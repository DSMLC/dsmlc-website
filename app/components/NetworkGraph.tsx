"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";

interface Node {
  id: string;
  name: string;
  connections: number;
  color?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
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
    const sampleNodes: Node[] = [
      {
        id: "1",
        name: "Joseph Tandyo",
        connections: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      },
      { id: "2", name: "Maheen", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
      { id: "3", name: "Gavin", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
      { id: "4", name: "Evan", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
      { id: "5", name: "Jason", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
      { id: "6", name: "Hanz", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
      { id: "7", name: "Dheeraj", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
      { id: "8", name: "Prantap", connections: 0, x: 0, y: 0, vx: 0, vy: 0 },
    ];

    const sampleLinks: Link[] = [
      { source: "1", target: "2", weight: 3 },
      { source: "1", target: "3", weight: 5 },
      { source: "1", target: "4", weight: 3 },
      { source: "1", target: "5", weight: 5 },
      { source: "1", target: "6", weight: 3 },
      { source: "1", target: "7", weight: 5 },
      { source: "2", target: "3", weight: 2 },
      { source: "2", target: "5", weight: 4 },
      { source: "3", target: "4", weight: 3 },
      { source: "4", target: "5", weight: 1 },
      { source: "5", target: "7", weight: 2 },
      { source: "6", target: "7", weight: 3 },
      { source: "1", target: "7", weight: 4 },
      { source: "3", target: "7", weight: 2 },
      { source: "4", target: "6", weight: 1 },
    ];

    sampleNodes.forEach((node) => {
      node.connections = sampleLinks.filter(
        (link) => link.source === node.id || link.target === node.id
      ).length;
    });

    const canvas = canvasRef.current;
    if (canvas) {
      sampleNodes.forEach((node, index) => {
        node.x = Math.random() * canvas.width;
        node.y = Math.random() * canvas.height;
      });
    }

    setNodes(sampleNodes);
    setLinks(sampleLinks);
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

    // Detect mouse movement & find nearest node
    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      hoveredNode =
        nodes.find((node) => {
          const dx = node.x - mouseX;
          const dy = node.y - mouseY;
          return Math.sqrt(dx * dx + dy * dy) < 20 + node.connections * 5;
        }) || null;
    });

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Identify relevant nodes and links for hover effect
      let relevantNodes = new Set();
      let relevantLinks = new Set();

      if (hoveredNode) {
        relevantNodes.add(hoveredNode.id);

        // Find directly connected nodes
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

      // Apply physics: Repulsion & Attraction forces
      nodes.forEach((node) => {
        node.vx = 0;
        node.vy = 0;

        nodes.forEach((other) => {
          if (node !== other) {
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let minDistance =
              20 + node.connections * 5 + (20 + other.connections * 5) + 50;

            if (distance > 0 && distance < minDistance) {
              let overlap = minDistance - distance;
              let adjustFactor = 0.2;
              node.vx -= (dx / distance) * overlap * adjustFactor;
              node.vy -= (dy / distance) * overlap * adjustFactor;
            }
          }
        });

        links.forEach((link) => {
          if (link.source === node.id || link.target === node.id) {
            const other = nodes.find(
              (n) =>
                n.id === (link.source === node.id ? link.target : link.source)
            );
            if (other) {
              const dx = other.x - node.x;
              const dy = other.y - node.y;
              let distance = Math.sqrt(dx * dx + dy * dy);
              let desiredDistance = 250;
              let force = (distance - desiredDistance) * 0.01;

              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          }
        });

        node.vx *= 0.85;
        node.vy *= 0.85;
        node.x += node.vx;
        node.y += node.vy;

        const padding = 50;
        node.x = Math.max(padding, Math.min(canvas.width - padding, node.x));
        node.y = Math.max(padding, Math.min(canvas.height - padding, node.y));
      });

      // Assign colors dynamically
      const getNodeColor = (connections: number) => {
        if (connections >= 7) return "#FF5733"; // Red for high connections
        return "#33FF57"; // Green for low connections
      };

      nodes.forEach((node) => {
        node.color = getNodeColor(node.connections);
      });

      // Detect parallel edges and apply offset
      const edgeCount = new Map();
      links.forEach((link) => {
        const key = [link.source, link.target].sort().join("-");
        edgeCount.set(key, (edgeCount.get(key) || 0) + 1);
      });

      const edgeOffsetTracker = new Map();

      // Draw links with hover effect & prevent overlap
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source);
        const target = nodes.find((n) => n.id === link.target);

        if (source && target) {
          const dominantNode =
            source.connections >= target.connections ? source : target;
          const key = [link.source, link.target].sort().join("-");

          if (!edgeOffsetTracker.has(key)) {
            edgeOffsetTracker.set(key, -((edgeCount.get(key) - 1) * 50)); // Spread edges apart
          }

          const offset = edgeOffsetTracker.get(key);
          edgeOffsetTracker.set(key, offset + 40); // Increment for next edge

          ctx.globalAlpha = hoveredNode
            ? relevantLinks.has(link)
              ? 1.0
              : 0.2
            : 1.0; // Dim non-relevant edges

          ctx.lineWidth = dominantNode.connections * 0.8;
          ctx.strokeStyle = dominantNode.color || "#FFFFFF";
          ctx.shadowColor = dominantNode.color || "#FFFFFF";
          ctx.shadowBlur = hoveredNode ? (relevantLinks.has(link) ? 5 : 0) : 0;

          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Draw animated dots along edges
          const t = (Math.sin(time) + 1) / 2;
          const dotX = source.x + (target.x - source.x) * t;
          const dotY = source.y + (target.y - source.y) * t;

          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw nodes with hover effect
      nodes.forEach((node) => {
        const radius = 20 + node.connections * 5;

        ctx.globalAlpha = hoveredNode
          ? relevantNodes.has(node.id)
            ? 1.0
            : 0.2
          : 1.0; // Dim non-relevant nodes
        ctx.fillStyle = node.color || "#FF9B5E";

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = "white";
        const fontSize = 12 + node.connections;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.name, node.x, node.y - 5);
        ctx.fillText(`(${node.connections})`, node.x, node.y + fontSize);
      });

      ctx.globalAlpha = 1.0; // Reset opacity
      requestAnimationFrame(animate);
    };

    animate();
  }, [nodes, links]);

  return (
    <div className="w-full max-w-4xl mx-auto">
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
