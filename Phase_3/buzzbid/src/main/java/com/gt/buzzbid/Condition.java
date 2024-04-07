package com.gt.buzzbid;

public enum Condition {
    NEW("New"),
    VERY_GOOD("Very Good"),
    GOOD("Good"),
    FAIR("Fair"),
    POOR("Poor");

    private String label;

    Condition(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
