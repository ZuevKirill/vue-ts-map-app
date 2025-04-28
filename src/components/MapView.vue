
<template>
  <div ref="mapEl" class="map"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import { LineString, Polygon, Point } from 'ol/geom'
import { Feature } from 'ol'
import { Stroke, Style, Fill, Circle  } from 'ol/style'
import { getTrack, getGeofenceCoords } from '@/services/api'
import { fromLonLat } from 'ol/proj'

const props = defineProps<{
  selectedDeviceId?: string,
  selectedZones: string[]
}>()

const mapEl = ref();
let map: Map
const trackSource = new VectorSource();
const geoSource = new VectorSource();
const markerSource = new VectorSource();

const trackLayer = new VectorLayer({
  source: trackSource,
  style: new Style({
    stroke: new Stroke({
      color: '#0078FF',
      width: 4,
    }),
  }),
})

const geoLayer = new VectorLayer({
  source: geoSource,
  style: new Style({
    stroke: new Stroke({ color: '#FF0000', width: 2 }),
    fill: new Fill({ color: 'rgba(255,0,0,0.1)' }),
  }),
})

const markerLayer = new VectorLayer({
  source: markerSource,
  style: new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color: '#0078FF' }),
      stroke: new Stroke({ color: '#fff', width: 2 }),
    }),
  })
})

watch(() => props.selectedDeviceId, async (newId) => {
  if (!newId) return
  const data = await getTrack(newId)
  const currentDevice = data[newId][0];  
  const coords = currentDevice.Lat.map((Lat: any, indx: number) => fromLonLat([currentDevice.Lng[indx], Lat]));
  const lastCoord = coords[coords.length - 1];
  const line = new Feature({ geometry: new LineString(coords) });
  const marker = new Feature({
    geometry: new Point(lastCoord),
  });
  
  line.setStyle(new Style({ stroke: new Stroke({ color: 'blue', width: 3 }) }))
  marker.setStyle(new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color: '#0078FF' }),
      stroke: new Stroke({ color: '#fff', width: 2 }),
    }),
  }));
  
  trackSource.clear();
  markerSource.clear();
  trackSource.addFeature(line);
  markerSource.addFeature(marker);
  map.getView().setCenter(lastCoord);
})

watch(() => props.selectedZones, async (zoneIds) => {
  geoSource.clear();
  const zones = await getGeofenceCoords(zoneIds.join(","));
  for (const id of zoneIds) {
    const currentZone = await zones[id];    
    const coords = currentZone?.Lat.map((Lat: any, indx: number) => {
      return fromLonLat([currentZone.Lng[indx], Lat])
    });
    const poly = new Feature({ geometry: new Polygon([coords]) });
    poly.setStyle(new Style({
      stroke: new Stroke({ color: 'green', width: 2 }),
      fill: new Fill({ color: 'rgba(0,255,0,0.2)' })
    }))
    geoSource.addFeature(poly);
  }
})

onMounted(() => {
  map = new Map({
    target: mapEl.value,
    layers: [
      new TileLayer({ source: new OSM() }),
      trackLayer,   // Трек транспорта
      geoLayer,     // Геозоны
      markerLayer, 
    ],
    view: new View({
      center: fromLonLat([61.4, 55.15]),
      zoom: 11
    })
  })
})
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100%;
}
</style>
