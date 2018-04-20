# Validation store

Store, display, share, and compare validation results.

## Validation report format

The project I've used this in used the following format

The top-level metadata in this JSON is used by the validation store in the list of reports.

The fields under `"misses"`, `"conf_mat"`, and `"binary_metrics"` are only used in the report visualzation and comparison pages.

```json
{
  "type": "<report_type>",
  "subtype": "<report_subtype>",
  "package_version": "",
  "config_version": "",
  "created_at": "2018-03-16T17:05:38.671190",
  "created_by": "petervarshavsky",
  "data_source": "<data source description, for example SQL query>"
  "misses": [
    {
      "confidence": 0.5172413793103449,
      "column_name": "first_column",
      "predicted_label": "foo",
      "true_label": "bar",
      "column_id": 1861
    },
    {
      "confidence": 0.9490445859872612,
      "column_name": "second_column",
      "predicted_label": "bar",
      "true_label": "foo",
      "column_id": 2234
    },
    ...
  ],
  "conf_mat": {
    "labels": [
      "foo",
      "bar",
      "baz",
      "qux",
    ],
    "matrix": [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 0, 4]]
  },
  "binary_metrics": [
    {
      "f1_score": NaN,
      "recall": 0.0,
      "accuracy": 0.4,
      "class": "foo",
      "precision": NaN
    },
    {
      "f1_score": 0.6666666666666666,
      "recall": 1.0,
      "accuracy": 0.4,
      "class": "bar",
      "precision": 0.5
    },
    {
      "f1_score": NaN,
      "recall": 0.0,
      "accuracy": 0.4,
      "class": "baz",
      "precision": NaN
    },
    {
      "f1_score": 0.888888888888889,
      "recall": 0.8,
      "accuracy": 0.4,
      "class": "qux",
      "precision": 1.0
    },
  ],
}
```

## Supported validation
The validation store only works with outputs of one project.

## Code
Currently this is a combination of Flask and D3. I'm planning to reimplement the UI in React.
D3 components like confusion matrices and tables are somewhat reusable, but need more cleaning up.

## Contributing
I'm curious if any other teams may find this useful. Send me a PR.
