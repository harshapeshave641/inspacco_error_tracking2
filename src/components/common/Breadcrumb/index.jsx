import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ path, className = "" }) {
  return (
    <div className={`text-sm breadcrumbs ${className}`}>
      <ul>
        {path.map(({ route, name }) => (
          <li>
            <Link {...(route && { to: route })}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-1 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
