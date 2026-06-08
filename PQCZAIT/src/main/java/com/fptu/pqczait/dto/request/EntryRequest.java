package com.fptu.pqczait.dto.request;

import lombok.*;
import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class EntryRequest {
    private Map<Integer, String> values;
}