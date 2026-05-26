package com.arthur.TaskFlow.service;


import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.arthur.TaskFlow.DTOs.TaskRequestDTO;
import com.arthur.TaskFlow.DTOs.TaskResponseDTO;
import com.arthur.TaskFlow.entity.Task;
import com.arthur.TaskFlow.entity.enums.Status;
import com.arthur.TaskFlow.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskResponseDTO createTask(TaskRequestDTO taskRequest) {
        Date now = new Date();
        Task task = new Task();
        task.setTitle(taskRequest.title());
        task.setDescription(taskRequest.description());
        task.setPriority(taskRequest.priority());
        task.setStatus(Status.TODO);
        task.setDueDate(now);
        Task savedTask = taskRepository.save(task);
        return new TaskResponseDTO(savedTask.getId(), savedTask.getTitle(), savedTask.getDescription(), savedTask.getPriority(), savedTask.getStatus(), savedTask.getDueDate().toString());
    }

    public TaskResponseDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        return new TaskResponseDTO(task.getId(), task.getTitle(), task.getDescription(), task.getPriority(), task.getStatus(), task.getDueDate().toString());
    }

    public TaskResponseDTO updateTask(Long id, TaskRequestDTO taskRequest) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle(taskRequest.title());
        task.setDescription(taskRequest.description());
        task.setPriority(taskRequest.priority());
        Task updatedTask = taskRepository.save(task);
        return new TaskResponseDTO(updatedTask.getId(), updatedTask.getTitle(), updatedTask.getDescription(), updatedTask.getPriority(), updatedTask.getStatus(), updatedTask.getDueDate().toString());
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found");
        }
        taskRepository.deleteById(id);
    }

    public List<TaskResponseDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(task -> new TaskResponseDTO(task.getId(), task.getTitle(), task.getDescription(), task.getPriority(), task.getStatus(), task.getDueDate().toString()))
                .collect(Collectors.toList());
    }

    public List<TaskResponseDTO> getAllTasksByStatus(Status status) {
        return taskRepository.findAll().stream()
                .filter(task -> task.getStatus().equals(status))
                .map(task -> new TaskResponseDTO(task.getId(), task.getTitle(), task.getDescription(), task.getPriority(), task.getStatus(), task.getDueDate().toString()))
                .collect(Collectors.toList());
    }


    public void updateTaskStatus(Long id, Status status) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        taskRepository.save(task);
    }


}
