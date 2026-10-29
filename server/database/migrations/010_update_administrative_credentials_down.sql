-- Rollback Migration 010
DELETE FROM `audit_logs` WHERE `action` = 'SYSTEM_MIGRATION' AND `entity_id` = '010';

