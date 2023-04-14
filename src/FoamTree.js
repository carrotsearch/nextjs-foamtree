import React, { useEffect, useRef, useState } from 'react';

export const FoamTree = ({ data }) => {
  const element = useRef();
  const [ foamtree, setFoamTree ] = useState();

  // Import FoamTree dynamically. FoamTree references browser APIs, so
  // it cannot run on the server side.
  useEffect(() => {
    import("@carrotsearch/foamtree").then(module => {
      setFoamTree(new module.FoamTree({
        element: element.current
      }));
    });

    return () => {
      if (foamtree) {
        foamtree.dispose();
        setFoamTree(null);
      }
    }
  }, []);

  // Set dataObject, if changed
  useEffect(() => {
    if (foamtree) {
      foamtree.set("dataObject", data);
    }
  }, [ foamtree, data ]);

  return (
      <div ref={element} style={{ width: "1024px", height: "768px" }}></div>
  );
};