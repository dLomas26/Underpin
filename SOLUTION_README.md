# Completed Take-Home Assignment

The `Underpin` folder contains:

- Jest unit tests for the service layer
- Supertest integration tests for all documented endpoints
- Edge-case and validation tests
- A pagination bug fix
- `PATCH /tasks/:id/assign`
- `BUG_REPORT.md`
- `SUBMISSION_NOTE.md`

Run:

```bash
cd Underpin
npm install
npm test -- --runInBand
npm run coverage
npm start
```

The assignment target is 80%+ coverage.
