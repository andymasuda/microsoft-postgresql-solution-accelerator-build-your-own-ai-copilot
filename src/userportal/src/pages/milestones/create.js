import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../api/Api';

const MilestoneCreate = () => {
  const { sowId } = useParams(); // Extract from URL
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var data = await api.milestones.create(sowId, name, status, dueDate);
      setSuccess('Milestone created successfully!');
      window.location.href = `/milestones/${data.id}`;
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to create Milestone');
      setSuccess(null);
    }
  };

  return (
    <div>
      <h1>Create Milestone</h1>
      <hr/>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Control
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
            />
        </Form.Group>
      
        <Button type="submit" variant="primary">
          <i className="fas fa-plus"></i> Create
        </Button>
        <a href={`/sows/${sowId}`} className="btn btn-secondary ms-2" aria-label="Cancel">
          <i className="fas fa-arrow-left"></i> Back to Sow
        </a>
      </Form>
    </div>
  );
};

export default MilestoneCreate;