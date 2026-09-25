import React from "react";
import { states } from "../data/states";

const nodes = {
  q0: { x: 120, y: 250 },
  q1: { x: 300, y: 150 },
  q2: { x: 500, y: 150 },
  q3: { x: 700, y: 150 },
  q4: { x: 880, y: 80 },
  q5: { x: 880, y: 230 },
  q6: { x: 1040, y: 80 },
  q7: { x: 300, y: 400 },
  q8: { x: 520, y: 400 },
  q9: { x: 700, y: 300 },
  q10: { x: 720, y: 500 }
};

const edges = [
  ["q0","q1","issue book"],
  ["q1","q2","check member"],
  ["q2","q3","valid ID"],
  ["q2","q9","invalid ID"],
  ["q3","q4","available"],
  ["q3","q5","unavailable"],
  ["q4","q6","confirm"],
  ["q5","q0","exit"],
  ["q6","q0","exit"],
  ["q0","q7","return book"],
  ["q7","q8","no fine"],
  ["q7","q10","fine due"],
  ["q10","q8","payment done"],
  ["q8","q0","exit"],
  ["q9","q0","exit"],
  ["q0","q0","wait / cancel"]
];

function nodePoint(id) {
  return nodes[id];
}

export default function AutomataDiagram({ currentState, animatingEdge, onSelectState }) {
  return (
    <div className="diagram-wrap">
      <svg className="automata-svg" viewBox="0 0 1160 590" role="img" aria-label="Library finite automaton state diagram">
        <defs>
          <marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L8,3.5 z" fill="currentColor" />
          </marker>
        </defs>

        {edges.map(([from, to, label], index) => {
          const a = nodePoint(from);
          const b = nodePoint(to);
          const active = animatingEdge?.from === from && animatingEdge?.to === to;

          if (from === to) {
            return (
              <g key={index} className={active ? "edge active-edge" : "edge"}>
                <path
                  d={`M ${a.x-25} ${a.y-28} C ${a.x-80} ${a.y-100}, ${a.x+80} ${a.y-100}, ${a.x+25} ${a.y-28}`}
                  fill="none"
                  markerEnd="url(#arrow)"
                />
                <text x={a.x} y={a.y-82} textAnchor="middle">{label}</text>
              </g>
            );
          }

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.max(Math.sqrt(dx*dx + dy*dy), 1);
          const ux = dx / dist;
          const uy = dy / dist;
          const startX = a.x + ux * 43;
          const startY = a.y + uy * 43;
          const endX = b.x - ux * 43;
          const endY = b.y - uy * 43;
          const mx = (startX + endX) / 2;
          const my = (startY + endY) / 2;
          const curve = from === "q0" && to === "q7" ? 45 : (from === "q7" && to === "q10" ? 35 : 0);
          const px = -uy * curve;
          const py = ux * curve;
          const cx = mx + px;
          const cy = my + py;

          return (
            <g key={index} className={active ? "edge active-edge" : "edge"}>
              <path
                d={`M ${startX} ${startY} Q ${cx || mx} ${cy || my} ${endX} ${endY}`}
                fill="none"
                markerEnd="url(#arrow)"
              />
              <text x={cx || mx} y={(cy || my) - 9} textAnchor="middle">{label}</text>
              {active && (
                <circle className="travel-dot">
                  <animateMotion
                    dur="0.65s"
                    repeatCount="1"
                    path={`M ${startX} ${startY} Q ${cx || mx} ${cy || my} ${endX} ${endY}`}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {states.map(state => {
          const p = nodePoint(state.id);
          const active = state.id === currentState;
          return (
            <g
              key={state.id}
              className={`state-node ${active ? "active-state" : ""} ${state.type}`}
              transform={`translate(${p.x},${p.y})`}
              onClick={() => onSelectState(state.id)}
            >
              <circle r="39" />
              <text className="state-id" y="-3" textAnchor="middle">{state.id}</text>
              <text className="state-name" y="14" textAnchor="middle">
                {state.name.length > 18 ? state.name.slice(0, 16) + "…" : state.name}
              </text>
              {active && <text className="current-label" y="59" textAnchor="middle">CURRENT</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}