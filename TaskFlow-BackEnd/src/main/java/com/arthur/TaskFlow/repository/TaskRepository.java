package com.arthur.TaskFlow.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.arthur.TaskFlow.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
