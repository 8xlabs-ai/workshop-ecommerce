# Grafana dashboards (as code)

Dashboards live here as JSON and are provisioned at deploy time.
The workshop runs without Grafana — these files exist so the repo
mirrors production layout.

- `dashboards/api-latency.json` — request P50/P95/P99 by route
- `dashboards/checkout-funnel.json` — cart → contact → shipping → review → confirmation
- `dashboards/payment-errors.json` — payx-sdk decline reasons

Loki indexes pino logs by `request_id` and `trace_id`. Use the
checkout-funnel dashboard's "Logs" panel to jump from a stuck order
to its trace.
