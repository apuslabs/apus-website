import { onCLS, onINP, onLCP } from "web-vitals";

onLCP(sendToGoogleAnalytics);
onINP(sendToGoogleAnalytics);
onCLS(sendToGoogleAnalytics);

function sendToGoogleAnalytics({ name, delta, value, id }) {
  window?.gtag("event", name, {
    value: delta,
    metric_id: id,
    metric_value: value,
    metric_delta: delta,
  });
}
