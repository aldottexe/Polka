<script lang="ts">
   import type { Action } from "svelte/action";

   const options = {
      repultion: 3,
      attraction: 0.3,
      damping: 0.9,
      border_repulsion: 0.03,
      border: 100,
      pressure: 0.5,
   };

   type node_T = {
      x: number;
      y: number;
      vx: number;
      vy: number;
   };
   type body_T = {
      idealLength: number;
      nodes: node_T[];
      color: number;
   };

   function createBody(
      node_count: number,
      idealLength: number,
      color: number,
      x: number,
      y: number,
      r: number,
   ): body_T {
      return {
         idealLength,
         color,
         nodes: Array.from({ length: node_count }, (v, k) => {
            const rad = (2 * Math.PI * k) / node_count;
            return {
               x: x + Math.random() * r,
               y: y + Math.random() * r,
               // x: x + Math.sin(rad) * r,
               // y: y + Math.cos(rad) * r,
               vx: 0,
               vy: -5,
            };
         }),
      };
   }

   function simulate(bodies: body_T[]) {
      // repulsive forces
      const points = bodies.flatMap((body) => body.nodes);

      // intrabody forces
      bodies.forEach((body) => {
         for (let i = 0; i < body.nodes.length; i++) {
            const a = body.nodes[i];
            const b = body.nodes[(i + 1) % body.nodes.length];

            // spring force between points
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy) || 0.01;
            const force = options.attraction * (dist - body.idealLength);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            a.vx -= fx;
            a.vy -= fy;
            b.vx += fx;
            b.vy += fy;

            // normal force
            //rotate vector
            const nx = (-dy / dist) * options.pressure;
            const ny = (dx / dist) * options.pressure;

            a.vx += nx;
            a.vy += ny;
            b.vx += nx;
            b.vy += ny;
         }
      });

      points.forEach((point) => {
         // apply velocity
         point.vx *= options.damping;
         point.vy *= options.damping;
         point.x += point.vx;
         point.y += point.vy;

         // gravity
         point.vy += 0.2;

         //
         if (point.y > 40) {
            point.vy = Math.min(point.vy, 0);
            point.y = 40;
         }
      });

      // collision detection
      let bodiesToTest = Array.from(bodies);
      let intersecter: body_T;
      while (bodiesToTest.length > 1) {
         intersecter = bodiesToTest.shift()!;
         bodiesToTest.forEach((intersectee) => {
            intersecter.nodes.forEach((intersecterNode, j) => {
               let intersects = 0;
               intersectee.nodes.forEach((intersecteeNode, i) => {
                  if (
                     pointInLine(
                        intersecterNode,
                        intersecteeNode,
                        intersectee.nodes[(i + 1) % intersectee.nodes.length],
                     )
                  )
                     intersects++;
               });
               console.log(
                  "calculating intersection between: ",
                  intersecter.color,
                  intersectee.color,
                  intersects % 2 == 1,
               );
            });
         });
      }
   }

   function pointInLine(p: node_T, l1: node_T, l2: node_T): boolean {
      if (p.y <= Math.min(l1.y, l2.y) || p.y >= Math.max(l1.y, l2.y))
         return false;
      return p.x > l1.x + ((p.y - l1.y) * (l2.x - l1.x)) / (l2.y - l1.y);
   }

   function findClosestEdge() {}

   function distFromPointToLine(p: node_T, l1: node_T, l2: node_T): number {
      const dx = l2.x - l1.x;
      const dy = l2.y - l1.y;
      return (
         Math.abs(dx * (l1.y - p.y) - (l1.x - p.x) * dy) / Math.hypot(dx, dy)
      );
   }

   let bodies: body_T[] = $state([
      createBody(5, 2, 2, 20, 40, 3),
      createBody(15, 2, 1, 60, 40, 3),
   ]);

   function animate() {
      simulate(bodies);
      window.requestAnimationFrame(animate);
   }
   const soft: Action = (node) => {
      animate();
   };

   let click = { x: 0, y: 0, dragging: false };
</script>

<div use:soft>
   <svg viewBox="0 0 100 40">
      {#each bodies as body, i}
         <polygon
            points={body.nodes.map((n) => `${n.x},${n.y}`).join(" ")}
            stroke={["#F5EDF0", "#3D2C2E", "#D1CCDC"][body.color]}
            fill="none"
            onclick={() => (body.idealLength = Math.random() * 10)}
         />
      {/each}
   </svg>
</div>
