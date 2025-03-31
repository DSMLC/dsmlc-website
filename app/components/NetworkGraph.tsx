"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { fetchLinks, fetchNodes } from "../Backend";
import supabase from "../supabase_client";
import { useTheme } from "../ThemeProvider";

interface Node {
  id: string;
  name: string;
  connections: number;
  color?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale?: number;
}

export interface Link {
  source: string;
  target: string;
  weight: number;
}

interface NetworkGraphProps {
  userId: string;
  links: Link[];
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ userId, links }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, setIsDarkMode } = useTheme();

  // For panning support
  const panRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // For zoom support (default zoom is 1)
  const zoomRef = useRef(1);

  const pinchInitialDistanceRef = useRef<number | null>(null);
  const pinchInitialZoomRef = useRef(zoomRef.current);

  // Reset handler: resets pan and zoom to initial values.
  const handleReset = () => {
    panRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
  };

  const toggleFullScreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const ensureDSMLCNode = (nodeList: Node[]): Node[] => {
    const exists = nodeList.some((n) => n.id === "dsmlc");
    if (!exists) {
      // Set a default position (e.g., center of a 500x500 area)
      nodeList.push({
        id: "dsmlc",
        name: "DSMLC",
        connections: 0,
        x: 250,
        y: 250,
        vx: 0,
        vy: 0,
      });
    }
    return nodeList;
  };

  const dsmlcLogoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/light_logo.png";
    dsmlcLogoRef.current = img;
  }, []);

  useEffect(() => {
    const loadNodes = async () => {
      const fetchedNodes = await fetchNodes();
      setNodes(ensureDSMLCNode(fetchedNodes));
    };

    loadNodes();

    const subscription = supabase
      .channel("realtime:NetworkGraphGameNames")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "NetworkGraphGameNames" },
        (payload) => {
          setNodes((prevNodes) =>
            ensureDSMLCNode([
              ...prevNodes,
              {
                id: payload.new.player_id,
                name: payload.new.name,
                connections: payload.new.connection_count,
                x: Math.random() * 500,
                y: Math.random() * 500,
                vx: 0,
                vy: 0,
              },
            ])
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "NetworkGraphGameNames" },
        (payload) => {
          setNodes((prevNodes) =>
            ensureDSMLCNode(
              prevNodes.map((node) =>
                node.id === payload.new.player_id
                  ? {
                      ...node,
                      name: payload.new.name,
                      connections: payload.new.connection_count,
                    }
                  : node
              )
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        handleReset();
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = 0.001;
      let newZoom = zoomRef.current - e.deltaY * zoomFactor;
      // Clamp zoom between 0.5 and 2 (adjust as needed)
      newZoom = Math.min(Math.max(newZoom, 0.5), 2);
      zoomRef.current = newZoom;
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let time = 0;
    let hoveredNode: Node | null = null;

    // --- Panning event listeners ---
    const handleMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      dragging.current = false;
    };

    // Handle Mouse Movement & Find Nearest Node
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // If dragging, update pan offset and skip hover detection.
      if (dragging.current) {
        const deltaX = event.clientX - lastMousePos.current.x;
        const deltaY = event.clientY - lastMousePos.current.y;
        panRef.current.x += deltaX;
        panRef.current.y += deltaY;
        lastMousePos.current = { x: event.clientX, y: event.clientY };
        return;
      }

      // For hover detection, adjust by pan and zoom:
      const adjustedX = (mouseX - panRef.current.x) / zoomRef.current;
      const adjustedY = (mouseY - panRef.current.y) / zoomRef.current;

      hoveredNode =
        nodes.find((node) => {
          const dx = node.x - adjustedX;
          const dy = node.y - adjustedY;
          const baseRadius = 20 + node.connections * 5;
          const effectiveRadius =
            node.id === "dsmlc" ? baseRadius + 50 : baseRadius;
          return Math.sqrt(dx * dx + dy * dy) < effectiveRadius;
        }) || null;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    // End panning event listeners

    // --- Touch Event Handlers ---
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        // Initiate pinch-to-zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        pinchInitialDistanceRef.current = Math.hypot(dx, dy);
        pinchInitialZoomRef.current = zoomRef.current;
      } else if (e.touches.length === 1) {
        // Single touch for panning
        dragging.current = true;
        lastMousePos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchInitialDistanceRef.current !== null) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        const newDistance = Math.hypot(dx, dy);
        const scaleFactor = newDistance / pinchInitialDistanceRef.current;
        let newTargetZoom = pinchInitialZoomRef.current * scaleFactor;
        // Clamp zoom between 0.5 and 2
        newTargetZoom = Math.min(Math.max(newTargetZoom, 0.5), 2);
      } else if (e.touches.length === 1 && dragging.current) {
        // Single touch for panning...
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastMousePos.current.x;
        const deltaY = touch.clientY - lastMousePos.current.y;
        panRef.current.x += deltaX;
        panRef.current.y += deltaY;
        lastMousePos.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        pinchInitialDistanceRef.current = null;
      }
      if (e.touches.length === 0) {
        dragging.current = false;
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchcancel", handleTouchEnd);

    // Physics Simulation: Repulsion & Attraction
    const applyPhysics = () => {
      nodes.forEach((node) => {
        node.vx = 0;
        node.vy = 0;

        // Apply repulsion between nodes
        nodes.forEach((other) => {
          if (node !== other) {
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance =
              20 + node.connections * 5 + (20 + other.connections * 5) + 50;

            if (distance > 0 && distance < minDistance) {
              const overlap = minDistance - distance;
              const adjustFactor = 0.2;
              node.vx -= (dx / distance) * overlap * adjustFactor;
              node.vy -= (dy / distance) * overlap * adjustFactor;
            }
          }
        });

        // Apply attraction based on links
        links.forEach((link) => {
          if (link.source === node.id || link.target === node.id) {
            const other = nodes.find(
              (n) =>
                n.id === (link.source === node.id ? link.target : link.source)
            );
            if (other) {
              const dx = other.x - node.x;
              const dy = other.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const desiredDistance = 250;
              const force = (distance - desiredDistance) * 0.01;
              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          }
        });

        // Apply friction
        node.vx *= 0.95;
        node.vy *= 0.95;

        // Add constant motion
        const time = Date.now() * 0.001; // Current time in seconds
        node.vx += Math.sin(time + node.id.charCodeAt(0)) * 0.1;
        node.vy += Math.cos(time + node.id.charCodeAt(0)) * 0.1;

        // Update position & prevent going out of bounds
        node.x += node.vx;
        node.y += node.vy;
      });
    };

    const getNodeColor = (connections: number) => {
      const maxConnections = Math.max(...nodes.map((n) => n.connections));
      const minConnections = Math.min(...nodes.map((n) => n.connections));
      const t =
        maxConnections === minConnections
          ? 0.5
          : (connections - minConnections) / (maxConnections - minConnections);

      const startH = 205;
      const midH = 28;
      const endH = 5;

      let hue;
      if (t < 0.5) {
        hue = startH + (midH - startH) * (t * 2);
      } else {
        hue = midH + (endH - midH) * ((t - 0.5) * 2);
      }
      const lightness = isDarkMode ? 40 : 60;

      return `hsl(${hue}, 75%, ${lightness}%)`;
    };

    const calculateEdgeOffsets = () => {
      const edgeCount = new Map();
      const edgeOffsetTracker = new Map();

      links.forEach((link) => {
        const key = [link.source, link.target].sort().join("-");
        edgeCount.set(key, (edgeCount.get(key) || 0) + 1);
      });

      links.forEach((link) => {
        const key = [link.source, link.target].sort().join("-");
        if (!edgeOffsetTracker.has(key)) {
          edgeOffsetTracker.set(key, -((edgeCount.get(key) - 1) * 50));
        }
        edgeOffsetTracker.set(key, edgeOffsetTracker.get(key) + 40);
      });

      return edgeOffsetTracker;
    };

    // Main animation loop
    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node) => {
        node.connections = links.filter(
          (link) => link.source === node.id || link.target === node.id
        ).length;
      });

      const relevantNodes = new Set<string>();
      const relevantLinks = new Set<Link>();

      if (hoveredNode) {
        relevantNodes.add(hoveredNode.id);
        links.forEach((link) => {
          const source = link.source;
          const target = link.target;
          const hoveredId = hoveredNode?.id;

          if (source === hoveredId || target === hoveredId) {
            relevantLinks.add(link);
            relevantNodes.add(link.source.toLowerCase());
            relevantNodes.add(link.target.toLowerCase());
          }
        });
      }

      applyPhysics();
      nodes.forEach((node) => (node.color = getNodeColor(node.connections)));

      const edgeOffsets = calculateEdgeOffsets();

      // Save context, apply pan offset and zoom
      ctx.save();
      ctx.translate(panRef.current.x, panRef.current.y);
      ctx.scale(zoomRef.current, zoomRef.current);

      // Draw links with hover effect
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source.toLowerCase());
        const target = nodes.find((n) => n.id === link.target.toLowerCase());

        if (source && target) {
          const dominantNode =
            source.connections >= target.connections ? source : target;
          const key = [link.source, link.target].sort().join("-");

          ctx.globalAlpha = hoveredNode
            ? relevantLinks.has(link)
              ? 1.0
              : 0.2
            : 1.0;

          ctx.lineWidth = 3;
          ctx.strokeStyle = dominantNode.color || "#FFFFFF";
          ctx.shadowColor = dominantNode.color || "#FFFFFF";
          ctx.shadowBlur = hoveredNode ? (relevantLinks.has(link) ? 10 : 0) : 0;

          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
          ctx.shadowBlur = 0;

          if (
            hoveredNode &&
            (hoveredNode.id === source.id || hoveredNode.id === target.id)
          ) {
            const t = (Math.sin(time) + 1) / 2;
            const dotX = source.x + (target.x - source.x) * t;
            const dotY = source.y + (target.y - source.y) * t;

            ctx.fillStyle = isDarkMode ? "#F5EACF" : "#222222";
            ctx.beginPath();
            ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Draw nodes with hover effect
      nodes.forEach((node) => {
        const radius =
          hoveredNode && relevantNodes.has(node.id)
            ? 24 + node.connections * 5
            : 20 + node.connections * 5;

        ctx.globalAlpha = hoveredNode
          ? relevantNodes.has(node.id)
            ? 1.0
            : 0.2
          : 1.0;

        if (node.id === "dsmlc") {
          // Make DSMLC node larger
          const dsmlcRadius = radius + 25; // Larger radius
          // Draw DSMLC circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, dsmlcRadius, 0, 2 * Math.PI);
          ctx.fillStyle = "#222222";
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = node.color || "#FF9B5E";
          ctx.stroke();
          // Draw the logo inside the circle (centered in the top half)
          const logoSize = dsmlcRadius * 0.8; // 80% of radius, adjust as needed
          if (dsmlcLogoRef.current?.complete) {
            ctx.drawImage(
              dsmlcLogoRef.current,
              node.x - logoSize / 2,
              node.y - dsmlcRadius * 0.35 - logoSize / 2,
              logoSize,
              logoSize
            );
          }
          // Draw DSMLC text centered below the logo
          ctx.fillStyle = "white";
          ctx.font = "bold 18px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("DSMLC", node.x, node.y + dsmlcRadius * 0.35);
          // Draw connection count below the DSMLC text
          ctx.font = "16px Arial";
          ctx.fillText(
            `(${node.connections})`,
            node.x,
            node.y + dsmlcRadius * 0.65
          );

          return;
        }

        const isUserNode = node.id === userId;

        if (node.scale !== undefined) {
          node.scale = Math.min(1, node.scale + 0.05);
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.scale(node.scale, node.scale);
          ctx.translate(-node.x, -node.y);
        }

        ctx.fillStyle = node.color || "#FF9B5E";

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        if (isUserNode) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#FFD700";
          ctx.shadowColor = "#FFD700";
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = isDarkMode ? "#F5EACF" : "#222222";
        const fontSize = 12 + node.connections;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.name, node.x, node.y - 5);
        ctx.fillText(`(${node.connections})`, node.x, node.y + fontSize);

        if (node.scale !== undefined) {
          ctx.restore();
        }
      });

      ctx.restore();
      ctx.globalAlpha = 1.0;
      requestAnimationFrame(animate);

      nodes.forEach((node) => {
        if (node.scale !== undefined && node.scale >= 1) {
          delete node.scale;
        }
      });
    };

    animate();

    // Cleanup event listeners on unmount
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [links, nodes, userId, isDarkMode]);

  return (
    <div className="w-full max-w-4xl mx-auto px-10">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleReset}
          className="md:text-base text-sm px-4 py-2 bg-dsmlcTangerine text-light-dsmlcBlack font-bold rounded-full"
        >
          Reset Zoom &amp; Pan
        </button>
        <button
          onClick={toggleFullScreen}
          className="md:text-base text-sm px-4 py-2 bg-dsmlcTangerine text-light-dsmlcBlack font-bold rounded-full ml-2"
        >
          Toggle Full Screen
        </button>
      </div>
      <div
        ref={containerRef}
        className="w-full h-[300px] md:h-[700px] lg:h-[800px] border border-[#FF9B5E]/20 rounded-lg overflow-hidden bg-light-dsmlcParchment dark:bg-dark-dsmlcParchment"
      >
        <canvas ref={canvasRef} style={{ touchAction: "none" }} />
      </div>
    </div>
  );
};

export default NetworkGraph;
