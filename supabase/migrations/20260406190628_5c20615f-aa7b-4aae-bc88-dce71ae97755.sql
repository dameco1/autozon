
ALTER TABLE cars DISABLE TRIGGER guard_car_system_fields;
UPDATE cars SET status = 'sold' WHERE id = '6643733a-a7d9-4055-9afa-d6698df0dcba';
ALTER TABLE cars ENABLE TRIGGER guard_car_system_fields;
