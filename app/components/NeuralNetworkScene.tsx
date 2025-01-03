"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/** Adjust these to get the look you want */
const NODE_COUNT = 45; // Number of nodes (neurons)
const LINK_DISTANCE = 10.5; // How far apart connected nodes are
const REACTION_INTENSITY = 0.002; // How strongly nodes react to mouse

// Each node in our neural network
interface Node {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  links: number[]; // IDs of nodes it links to
}

/**
 * Generate a random graph for demonstration:
 * - Places nodes randomly.
 * - Links each node with 1-3 random neighbors.
 */
function createRandomGraph(count: number): Node[] {
  const nodes: Node[] = [];

  for (let i = 0; i < count; i++) {
    nodes.push({
      id: i,
      position: [
        (Math.random() - 0.5) * 10, // x
        (Math.random() - 0.5) * 10, // y
        (Math.random() - 0.5) * 10, // z
      ],
      velocity: [0, 0, 0],
      links: [],
    });
  }

  return nodes;
}

function NodeMesh({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      {/* A small sphere for each node */}
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#FF914D" />
    </mesh>
  );
}

/**
 * NeuralNetwork: The main scene that handles node positions, rendering,
 * and interaction with the mouse.
 */
function NeuralNetwork() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const { mouse } = useThree();

  useEffect(() => {
    // Generate a random graph
    const graph = createRandomGraph(NODE_COUNT);
    setNodes(graph);
  }, []);

  // Animate frame by frame
  useFrame(() => {
    setNodes((prev) => {
      return prev.map((node) => {
        let [x, y, z] = node.position;
        let [vx, vy, vz] = node.velocity;

        // Mouse-based slight repulsion or attraction
        // mouse.x / mouse.y are in [-1, 1] (center is 0,0)
        const targetX = mouse.x * 15; // scale for effect
        const targetY = mouse.y * 15;

        // Simple approach: move slightly away from the mouse
        // or you can invert for attraction.
        const dx = x + targetX;
        const dy = y + targetY;

        // We won't do anything with z for mouse reaction, but you could.
        // We just add a small force away from the pointer
        vx += dx * REACTION_INTENSITY;
        vy += dy * REACTION_INTENSITY;

        // Dampen velocity (friction effect)
        vx *= 0.95;
        vy *= 0.95;
        vz *= 0.95;

        // Update positions
        x += vx * 0.01;
        y += vy * 0.01;
        z += vz * 0.01;

        // If nodes get too far, bounce them back toward origin
        const dist = Math.sqrt(x * x + y * y + z * z);
        if (dist > 15) {
          vx -= (x / dist) * 0.05;
          vy -= (y / dist) * 0.05;
          vz -= (z / dist) * 0.05;
        }

        return {
          ...node,
          position: [x, y, z],
          velocity: [vx, vy, vz],
        };
      });
    });
  });

  // Check distance between linked nodes to simulate a subtle "pull" or "push"
  // You could further refine this for a real spring physics model.
  useFrame(() => {
    setNodes((prev) => {
      const updated = [...prev];
      for (let i = 0; i < updated.length; i++) {
        const n1 = updated[i];
        n1.links.forEach((linkId) => {
          const n2 = updated[linkId];
          const [x1, y1, z1] = n1.position;
          const [x2, y2, z2] = n2.position;

          const dx = x2 - x1;
          const dy = y2 - y1;
          const dz = z2 - z1;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // If they're too far, apply a small pulling force
          if (distance > LINK_DISTANCE) {
            const force = (distance - LINK_DISTANCE) * 0.001;
            n1.velocity[0] += dx * force;
            n1.velocity[1] += dy * force;
            n1.velocity[2] += dz * force;
            n2.velocity[0] -= dx * force;
            n2.velocity[1] -= dy * force;
            n2.velocity[2] -= dz * force;
          }
        });
      }
      return updated;
    });
  });

  return (
    <>
      {/* Draw the nodes */}
      {nodes.map((node) => (
        <NodeMesh key={node.id} position={node.position} />
      ))}
    </>
  );
}

/**
 * NeuralNetworkScene: Wrapper that places the 3D Canvas behind your hero content.
 * Position it absolutely to fill the container.
 */
export default function NeuralNetworkScene() {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <ambientLight intensity={2} />

        <NeuralNetwork />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}
