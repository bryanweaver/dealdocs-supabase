-- Add DELETE policy for etch_packets table
-- Users should be able to delete their own etch packets

CREATE POLICY "Users can delete own etch packets" ON etch_packets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = etch_packets.contract_id 
      AND contracts.user_id = auth.uid()
    )
  );