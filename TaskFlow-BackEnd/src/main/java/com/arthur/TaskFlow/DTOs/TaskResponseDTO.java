package com.arthur.TaskFlow.DTOs;

import com.arthur.TaskFlow.entity.enums.Priority;
import com.arthur.TaskFlow.entity.enums.Status;

public record TaskResponseDTO(Long id, String title, String description, Priority priority, Status status, String dueDate) {

}
