import { useRef, useEffect } from "react";

export function getSectionListData(data) {
  let restructured = [];
  data.map(item => {
    let obj = restructured.find(
      x =>
        x.network == item.network.charAt(0).toUpperCase() + item.network.slice(1)
    );
    if (obj) {
      restructured[restructured.indexOf(obj)].data.push({
        id: item.id,
        name: item.name,
        address: item.address,
        network: item.network,
      });
    } else {
      restructured.push({
        network: item.network.charAt(0).toUpperCase() + item.network.slice(1),
        data: [
          {
            id: item.id,
            name: item.name,
            address: item.address,
            network: item.network,
          },
        ],
      });
    }
  });
  return restructured;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
