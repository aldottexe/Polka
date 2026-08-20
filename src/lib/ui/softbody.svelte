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

      
      
      bodies.forEach((b) => simulatePressure(b));
      
      const points = bodies.flatMap((body) => body.nodes);
      applyVelocityAndGravity(points)

      // collision detection
      fixIntersections(bodies);
   }

   function simulatePressure(b: body_T) {
      for (let i = 0; i < b.nodes.length; i++) {
            const n1 = b.nodes[i];
            const n2 = b.nodes[(i + 1) % b.nodes.length];

            // spring force between points
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const dist = Math.hypot(dx, dy) || 0.01;
            const force = options.attraction * (dist - b.idealLength);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx -= fx;
            n1.vy -= fy;
            n2.vx += fx;
            n2.vy += fy;

            // normal force
            //rotate vector
            const nx = (-dy / dist) * options.pressure;
            const ny = (dx / dist) * options.pressure;

            n1.vx += nx;
            n1.vy += ny;
            n2.vx += nx;
            n2.vy += ny;
         }
   }

   function applyVelocityAndGravity(points: node_T[]) {
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
         if (point.x < 0) {
            point.vx = Math.max(point.vx, 0);
            point.x = 0;
         }
         if (point.x > 100) {
            point.vx = Math.min(point.vx, 0);
            point.x = 100;
         }
      });
   }

   function fixIntersections(bodies: body_T[]) {
      const maxIterations = 20;

      for (let iteration = 0; iteration < maxIterations; iteration++) {
         let fixedIntersection = false;

         for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
               const bodyA = bodies[i];
               const bodyB = bodies[j];

               if (!bodiesIntersecting(bodyA, bodyB)) continue;

               const centerA = bodyCenter(bodyA);
               const centerB = bodyCenter(bodyB);

               let dx = centerA.x - centerB.x;
               let dy = centerA.y - centerB.y;
               const distance = Math.hypot(dx, dy);

               if (distance === 0) {
                  dx = 1;
                  dy = 0;
               } else {
                  dx /= distance;
                  dy /= distance;
               }

               const separation = 0.5;

               bodyA.nodes.forEach((node) => {
                  node.x += dx * separation;
                  node.y += dy * separation;
               });

               bodyB.nodes.forEach((node) => {
                  node.x -= dx * separation;
                  node.y -= dy * separation;
               });

               fixedIntersection = true;
            }
         }

         if (!fixedIntersection) break;
      }
   }

   function bodiesIntersecting(b1: body_T, b2: body_T) {
      // if any node is intersecting the other body, return true.
      return (
         b1.nodes.some(n => nodeInBody(b2, n)) ||
         b2.nodes.some(n => nodeInBody(b1, n))
      )
   }

   function bodyCenter(body: body_T): node_T {
      const center = body.nodes.reduce(
         (result, node) => ({
            x: result.x + node.x,
            y: result.y + node.y,
         }),
         { x: 0, y: 0 },
      );

      return {
         x: center.x / body.nodes.length,
         y: center.y / body.nodes.length,
         vx: 0,
         vy: 0,
      };
   }

   function nodeInBody(b: body_T, n: node_T) {
      const ns = b.nodes
      let intersects = 0;
      for(let i = 0; i < ns.length; i++)
         if (nodeRightOfLineSegment(n, ns[i], ns[(i + 1) % ns.length])) 
            intersects++
      return intersects % 2 == 1;
   }

   function nodeRightOfLineSegment(p: node_T, l1: node_T, l2: node_T): boolean {
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
      createBody(5, 2, 2, 20, 40, 3),
      createBody(15, 2, 1, 20, 80, 3),
      createBody(15, 2, 1, 20, 80, 3),
      createBody(15, 2, 1, 20, 80, 3),
      // {idealLength: 2, color: 1, nodes: [
      //    {x: 1, y: 1, vx: 0, vy: 0},
      //    {x: 1, y: 10, vx: 0, vy: 0},
      //    {x: 15, y: 10, vx: 0, vy: 0},
      // ]},
      // {idealLength: 2, color: 2, nodes: [
      //    {x: 5, y: 5, vx: 0, vy: 0},
      //    {x: 5, y: 12, vx: 0, vy: 0},
      //    {x: 12, y: 12, vx: 0, vy: 0},
      // ]}
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
   <svg viewBox="0 0 100 40" height=400 width=1000>
      {#each bodies as body, i}
         <polygon
            points={body.nodes.map((n) => `${n.x},${n.y}`).join(" ")}
            fill={["#F5EDF0", "#3D2C2E", "#D1CCDC"][body.color]}
            onclick={() => (body.idealLength = Math.random() * 10)}
         />
      {/each}
   </svg>
</div>
