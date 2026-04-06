
-- One-time fix: mark completed-transaction cars as sold
UPDATE cars SET status = 'sold'
WHERE id IN (
  SELECT t.car_id FROM transactions t
  WHERE t.status = 'completed' AND t.current_step = 5
)
AND status = 'available';
