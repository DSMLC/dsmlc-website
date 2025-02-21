"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { fetchNodes } from "../Backend";
import supabase from "../supabase_client";

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

interface Link {
  source: string;
  target: string;
  weight: number;
}

const NetworkGraph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNodes = async () => {
      const fetchedNodes = await fetchNodes();
      setNodes(fetchedNodes);
    };

    loadNodes(); // Initial fetch

    // Listen for real-time updates
    const subscription = supabase
      .channel("realtime:NetworkGraphGameNames")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "NetworkGraphGameNames" },
        (payload) => {
          console.log("New player added:", payload.new);

          setNodes((prevNodes) => [
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
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    // const sampleNodes: Node[] = [
    //   { id: "1", name: "Joseph", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
    //   { id: "2", name: "Maheen", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
    //   { id: "3", name: "Gavin", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
    //   { id: "4", name: "Evan", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
    //   { id: "5", name: "Jason", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
    //   { id: "6", name: "Hanz", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
    //   { id: "7", name: "Dheeraj", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
    //   { id: "8", name: "Prantap", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
    // ];

    // const sampleLinks: Link[] = [
    //   { source: "1", target: "2", weight: 3 },
    //   { source: "1", target: "3", weight: 5 },
    //   { source: "1", target: "4", weight: 3 },
    //   { source: "1", target: "5", weight: 5 },
    //   { source: "1", target: "6", weight: 3 },
    //   { source: "1", target: "7", weight: 5 },
    //   { source: "2", target: "3", weight: 2 },
    //   { source: "2", target: "5", weight: 4 },
    //   { source: "3", target: "4", weight: 3 },
    //   { source: "4", target: "5", weight: 1 },
    //   { source: "5", target: "7", weight: 2 },
    //   { source: "6", target: "7", weight: 3 },
    //   { source: "1", target: "7", weight: 4 },
    //   { source: "3", target: "7", weight: 2 },
    //   { source: "4", target: "6", weight: 1 },
    // ];

    // nodes.forEach((node) => {
    //   node.connections = sampleLinks.filter(
    //     (link) => link.source === node.id || link.target === node.id
    //   ).length;
    // });

    const canvas = canvasRef.current;
    if (canvas) {
      nodes.forEach((node, index) => {
        node.x = Math.random() * canvas.width;
        node.y = Math.random() * canvas.height;
      });
    }

    setNodes(nodes);
    // setLinks(sampleLinks);
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    let hoveredNode: Node | null = null;

    // Handle Mouse Movement & Find Nearest Node
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      hoveredNode =
        nodes.find((node) => {
          const dx = node.x - mouseX;
          const dy = node.y - mouseY;
          return Math.sqrt(dx * dx + dy * dy) < 20 + node.connections * 5;
        }) || null;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

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
        const padding = 50;
        node.x = Math.max(
          padding,
          Math.min(canvas.width - padding, node.x + node.vx)
        );
        node.y = Math.max(
          padding,
          Math.min(canvas.height - padding, node.y + node.vy)
        );
      });
    };

    const getNodeColor = (connections: number) => {
      const maxConnections = Math.max(...nodes.map((n) => n.connections));
      const minConnections = Math.min(...nodes.map((n) => n.connections));
      const t =
        maxConnections === minConnections
          ? 0.5 // Avoid division by zero if all connections are the same
          : (connections - minConnections) / (maxConnections - minConnections);

      // Define HSL color stops (hue values)
      const startH = 205; // Deep Teal Blue (#2A6F97)
      const midH = 28; // Warm Copper Orange (#E67E22)
      const endH = 5; // Deep Rust Red (#99231E)

      // Linearly interpolate hue values
      let hue;
      if (t < 0.5) {
        hue = startH + (midH - startH) * (t * 2); // Transition: Blue → Orange
      } else {
        hue = midH + (endH - midH) * ((t - 0.5) * 2); // Transition: Orange → Red
      }

      return `hsl(${hue}, 75%, 40%)`; // Reduced brightness to avoid bright yellow
    };

    // Calculate parallel edge offsets
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
          edgeOffsetTracker.set(key, -((edgeCount.get(key) - 1) * 50)); // Spread edges apart
        }
        edgeOffsetTracker.set(key, edgeOffsetTracker.get(key) + 40);
      });

      return edgeOffsetTracker;
    };

    // Main animation loop
    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Determine nodes & links to highlight on hover
      const relevantNodes = new Set();
      const relevantLinks = new Set();

      if (hoveredNode) {
        relevantNodes.add(hoveredNode.id);
        links.forEach((link) => {
          if (
            link.source === hoveredNode!.id ||
            link.target === hoveredNode!.id
          ) {
            relevantLinks.add(link);
            relevantNodes.add(link.source);
            relevantNodes.add(link.target);
          }
        });
      }

      applyPhysics();
      nodes.forEach((node) => (node.color = getNodeColor(node.connections)));

      const edgeOffsets = calculateEdgeOffsets();

      // Draw links with hover effect
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source);
        const target = nodes.find((n) => n.id === link.target);

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

          // Draw animated dots along edges
          // Draw animated dots along edges ONLY if they are connected to hoveredNode
          if (
            hoveredNode &&
            (hoveredNode.id === source.id || hoveredNode.id === target.id)
          ) {
            const t = (Math.sin(time) + 1) / 2;
            const dotX = source.x + (target.x - source.x) * t;
            const dotY = source.y + (target.y - source.y) * t;

            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Draw nodes with hover effect
      nodes.forEach((node) => {
        if (node.scale !== undefined) {
          node.scale = Math.min(1, node.scale + 0.05);
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.scale(node.scale, node.scale);
          ctx.translate(-node.x, -node.y);
        }

        const radius =
          hoveredNode && relevantNodes.has(node.id)
            ? 24 + node.connections * 5 // Slightly larger when hovered
            : 20 + node.connections * 5;
        ctx.globalAlpha = hoveredNode
          ? relevantNodes.has(node.id)
            ? 1.0
            : 0.2
          : 1.0;
        ctx.fillStyle = node.color || "#FF9B5E";

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        // Draw node label
        ctx.fillStyle = "white";
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
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [nodes, links]);

  const addNode = () => {
    setNodes((prevNodes) => {
      const newId = (prevNodes.length + 1).toString();
      const newNode: Node = {
        id: newId,
        name: `New Node ${newId}`,
        connections: 1, // It will be connected to Joseph Tandyo
        x: Math.random() * 500, // Random position for now
        y: Math.random() * 500,
        vx: 0,
        vy: 0,
        scale: 0,
      };

      // Add new link connecting to Joseph Tandyo (Node ID: "1")
      setLinks((prevLinks) => [
        ...prevLinks,
        { source: "1", target: newId, weight: 3 }, // Connect to Joseph
      ]);

      return [...prevNodes, newNode];
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <button
        onClick={addNode}
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Node
      </button>
      <div
        ref={containerRef}
        className="border border-[#FF9B5E]/20 rounded-lg overflow-hidden"
        style={{ height: "600px" }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default NetworkGraph;
