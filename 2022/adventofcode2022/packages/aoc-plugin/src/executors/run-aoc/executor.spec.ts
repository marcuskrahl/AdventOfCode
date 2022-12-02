import { RunAocExecutorSchema } from './schema';
import executor from './executor';

const options: RunAocExecutorSchema = {};

describe('RunAoc Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});