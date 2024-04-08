package com.gt.buzzbid;

import java.util.Arrays;

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

    public static Condition getByLabel(String label) {
        return Arrays.asList(Condition.values()).stream().filter(c -> c.getLabel().equals(label)).findAny().orElse(Condition.NEW);
    }
}
