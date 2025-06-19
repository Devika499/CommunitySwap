package com.swaphub.repository;

import com.swaphub.model.PointsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PointsLogRepository extends JpaRepository<PointsLog, UUID> {
    List<PointsLog> findByUserId(UUID userId);
}