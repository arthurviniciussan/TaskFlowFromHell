package com.arthur.TaskFlow.DTOs;

import com.arthur.TaskFlow.entity.enums.Priority;

public record TaskRequestDTO(String title, String description, Priority priority) {

}
