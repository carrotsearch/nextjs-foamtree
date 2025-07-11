import React, { useEffect, useRef, useState } from 'react';

export const FoamTree = ({ data }) => {
  const element = useRef();

  // Dynamically imported FoamTree implementation.
  const [ FoamTreeClass, setFoamTreeClass ] = useState();

  // FoamTree instance embedded in the element.
  const [ foamtreeInstance, setFoamTreeInstance ] = useState();

  // Import FoamTree implementation. FoamTree references browser APIs,
  // so we need to import it dynamically at mount time.
  useEffect(() => {
    let disposed = false;
    import("@carrotsearch/foamtree").then(module => {
      if (disposed) {
        // Element got unmounted before import finished loading, discard result.
        return;
      }

      if (!disposed) {
        // We want to set the FoamTree constructor to the state, so to prevent React
        // from invoking the constructor (through the functional variant of set state),
        // we wrap it in another function call.
        setFoamTreeClass(() => module.FoamTree);
      }
    });

    return () => {
      disposed = true;
    }
  }, []);

  // Initialize FoamTree instance
  useEffect(() => {
    // If the FoamTree instance is already created, let the effect run to
    // capture the instance into the disposal closure, so that we have a handle
    // we can use to call foamtree.dispose().
    if (FoamTreeClass && !foamtreeInstance) {
      setFoamTreeInstance(new FoamTreeClass({
        element: element.current
      }));
    }

    return () => {
      if (foamtreeInstance) {
        foamtreeInstance.dispose();
        setFoamTreeInstance(null);
      }
    }
  }, [ FoamTreeClass, foamtreeInstance ]);

  // Set dataObject, if changed
  useEffect(() => {
    if (foamtreeInstance) {
      foamtreeInstance.set("dataObject", data);
    }
  }, [ foamtreeInstance, data ]);

  return (
      <div ref={element} style={{ width: "1024px", height: "768px" }}></div>
  );
};