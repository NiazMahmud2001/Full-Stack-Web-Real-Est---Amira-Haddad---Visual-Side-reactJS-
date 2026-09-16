import React, { useState, useEffect, useMemo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { useProperties } from "../hooks/useProperties";
import { useAreas } from "../context/ContentContext";

import NavBar from "../components/layout/NavBar";
import Property3DMap from "../components/map/Property3DMap";
import ChatPanel from "../components/chat/ChatPanel";
import ListingRail from "../components/explorer/ListingRail";



export default function Explorer() {
  const { properties } = useProperties(200);
  const { areaEmirate } = useAreas();
  const [focus, setFocus] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Keyed by area *and* by emirate, so the chat can quote a count for either
  // "Saadiyat Island" or a plain "Abu Dhabi" from the same lookup.
  const countByArea = useMemo(() => {
    const map = {};
    properties.forEach((p) => {
      map[p.area] = (map[p.area] || 0) + 1;
      const emirate = areaEmirate(p.area);
      if (emirate) map[emirate] = (map[emirate] || 0) + 1;
    });
    return map;
  }, [properties, areaEmirate]);

  const handle = (
    <PanelResizeHandle
      className={`group flex items-center justify-center bg-sage ${
        isMobile ? "h-3 w-full cursor-row-resize" : "w-3 cursor-col-resize"
      }`}
    >
      <div
        className={`rounded-full bg-ink/25 transition-colors group-hover:bg-brass ${
          isMobile ? "h-1 w-12" : "h-12 w-1"
        }`}
      />
    </PanelResizeHandle>
  );

  return (
    <div className="flex h-screen flex-col bg-sand">
      <NavBar />
      <PanelGroup
        direction={isMobile ? "vertical" : "horizontal"}
        className="flex-1 overflow-hidden p-2"
      >
        <Panel defaultSize={62} minSize={25}>
          <div className="flex h-full flex-col gap-2">
            <div className="flex-1 overflow-hidden rounded-2xl border border-ink/10 bg-sage shadow-lift">
              <Property3DMap properties={properties} focus={focus} />
            </div>
            {/* On narrow screens the panels stack on top of each other, so the
                listing rail is left out to give the map the room. */}
            {!isMobile && (
              <div className="h-72 shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-sage">
                <ListingRail properties={properties} focus={focus} />
              </div>
            )}
          </div>
        </Panel>
        {handle}
        <Panel defaultSize={38} minSize={20}>
          <div className="h-full overflow-hidden rounded-2xl border border-ink/10 bg-sand shadow-lift">
            <ChatPanel onFocusArea={setFocus} propertyCountByArea={countByArea} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}












