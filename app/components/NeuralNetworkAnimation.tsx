"use client";
import React, { useRef, useEffect } from "react";
import p5 from "p5";

// Helper types
type Node = { x: number; y: number; size: number };
type Edge = [number, number];

interface NetworkData {
  layersData: Node[][];
  edges: Edge[][];
}

/**
 * Generates layers of nodes and random edges between consecutive layers.
 * @param p p5 instance
 * @param layerCount how many vertical "layers"
 * @param layerSpacing distance between each layer
 * @param startY top offset
 * @param xRange a tuple [minX, maxX] for node placement
 * @param minNodes min # of nodes per layer
 * @param maxNodes max # of nodes per layer
 * @returns {NetworkData} an object with layersData and edges
 */
function createNetworkData(
  p: p5,
  layerCount: number,
  layerSpacing: number,
  startY: number,
  xRange: [number, number],
  minNodes: number,
  maxNodes: number
): NetworkData {
  const layersData: Node[][] = [];
  const edges: Edge[][] = [];

  // 1) Generate layers
  for (let layerIdx = 0; layerIdx < layerCount; layerIdx++) {
    const nodeCount = p.floor(p.random(minNodes, maxNodes + 1));
    const layerY = startY + layerIdx * layerSpacing;

    const layerNodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      // Place each node in the constrained horizontal range
      const x = p.random(xRange[0], xRange[1]);
      // small vertical jitter so nodes aren’t perfectly in one line
      const y = layerY + p.random(-15, 15);
      const size = p.random(6, 20);
      layerNodes.push({ x, y, size });
    }

    layersData.push(layerNodes);
  }

  // 2) Connect random edges between consecutive layers
  for (let i = 0; i < layerCount - 1; i++) {
    const currentLayer = layersData[i];
    const nextLayer = layersData[i + 1];
    const layerEdges: Edge[] = [];

    currentLayer.forEach((_, idxCurr) => {
      // Each node connects to 1 or 2 random nodes in the next layer
      const connections = p.floor(p.random(1, 3));
      for (let c = 0; c < connections; c++) {
        const idxNext = p.floor(p.random(nextLayer.length));
        layerEdges.push([idxCurr, idxNext]);
      }
    });
    edges.push(layerEdges);
  }

  return { layersData, edges };
}

const SideNetworksAnimation = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5 | null = null;

    const sketch = (p: p5) => {
      // CONFIG
      const LAYERS = 6; // how many vertical layers
      const LAYER_SPACING = 120; // vertical gap between layers
      const MIN_NODES = 2;
      const MAX_NODES = 4;

      // We'll generate 2 networks: left side, right side.
      let leftNetwork: NetworkData;
      let rightNetwork: NetworkData;

      // Dynamically compute total scrollable height (scrollHeight - window height)
      function getTotalScrollableHeight() {
        // The document’s full height minus the viewport height
        return (
          Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
          ) - window.innerHeight
        );
      }

      p.setup = () => {
        const cnv = p.createCanvas(window.innerWidth, window.innerHeight);
        if (canvasRef.current) {
          cnv.parent(canvasRef.current);
        }

        // Calculate total vertical height spanned by the layers
        const totalHeight = (LAYERS - 1) * LAYER_SPACING;
        // Center them vertically
        const startY = p.height / 2 - totalHeight / 2;

        // For the left side, pick an x-range near the left edge
        const leftXRange: [number, number] = [50, p.width * 0.3];
        leftNetwork = createNetworkData(
          p,
          LAYERS,
          LAYER_SPACING,
          startY,
          leftXRange,
          MIN_NODES,
          MAX_NODES
        );

        // For the right side, pick an x-range near the right edge
        const rightXRange: [number, number] = [p.width * 0.7, p.width - 50];
        rightNetwork = createNetworkData(
          p,
          LAYERS,
          LAYER_SPACING,
          startY,
          rightXRange,
          MIN_NODES,
          MAX_NODES
        );

        p.strokeWeight(2);
      };

      p.draw = () => {
        p.clear();

        const scrollY = window.scrollY || 0;
        // Calculate how far the user has scrolled as a fraction [0..1]
        const totalScrollable = getTotalScrollableHeight();
        const scrollFraction =
          totalScrollable > 0 ? scrollY / totalScrollable : 1;

        // Map that fraction into the layer range 0..(LAYERS - 1)
        // so that at scrollFraction=0 we highlight layer 0,
        // and at scrollFraction=1 we highlight the last layer.
        const progress = p.map(scrollFraction, 0, 1, 0, LAYERS - 1, true);

        // Draw left side
        drawNetwork(p, leftNetwork, progress);

        // Draw right side
        drawNetwork(p, rightNetwork, progress);
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };

      /**
       * Draw the entire network (layers and edges) based on the "progress" value.
       * progress = 0 => only first layer is partially lit
       * progress = LAYERS => entire network is fully lit
       */
      function drawNetwork(
        p: p5,
        { layersData, edges }: NetworkData,
        progress: number
      ) {
        for (let i = 0; i < layersData.length; i++) {
          // Draw edges from layer i to i+1
          if (i < layersData.length - 1) {
            const partial = progress - i;
            const currentLayer = layersData[i];
            const nextLayer = layersData[i + 1];
            edges[i].forEach(([idxCurr, idxNext]) => {
              const n1 = currentLayer[idxCurr];
              const n2 = nextLayer[idxNext];

              if (partial <= 0) {
                // Not reached this layer’s edges yet
                p.stroke(60, 60, 60, 100); // dark grey with low opacity
                p.line(n1.x, n1.y, n1.x, n1.y);
              } else if (partial >= 1) {
                // fully highlight edge
                p.stroke(255, 145, 77);
                p.line(n1.x, n1.y, n2.x, n2.y);
              } else {
                // partially highlight
                const partX = p.lerp(n1.x, n2.x, partial);
                const partY = p.lerp(n1.y, n2.y, partial);

                // unlit portion
                p.stroke(60);
                p.line(n2.x, n2.y, partX, partY);

                // lit portion
                p.stroke(255, 145, 77);
                p.line(n1.x, n1.y, partX, partY);
              }
            });
          }

          // Draw nodes in this layer
          const nodeArray = layersData[i];
          for (let n = 0; n < nodeArray.length; n++) {
            const { x, y, size } = nodeArray[n];
            if (progress >= i) {
              // highlight
              p.fill(255, 145, 77);
              p.noStroke();
              p.circle(x, y, size);
            }
          }
        }
      }
    };

    p5Instance = new p5(sketch);

    return () => {
      p5Instance?.remove();
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="pointer-events-none fixed top-0 left-0 w-screen h-screen -z-10"
    />
  );
};

export default SideNetworksAnimation;
