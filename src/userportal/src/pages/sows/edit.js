import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { useParams } from 'react-router-dom';
import api from '../../api/Api';
import ConfirmModal from '../../components/ConfirmModal';
import PagedTable from '../../components/PagedTable';

const SOWEdit = () => {
  const { id } = useParams(); // Extract SOW ID from URL
  const [sowNumber, setSowNumber] = useState('');
  const [msaId, setMsaId] = useState('');
  const [sowDocument, setSowDocument] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [metadata, setMetadata] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [msas, setMsas] = useState([]);

  const [showDeleteMilestoneModal, setShowDeleteMilestoneModal] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState(null);
  const [reloadMilestones, setReloadMilestones] = useState(false);
  
  useEffect(() => {
    const fetchMSAs = async () => {
      try {
        const data = await api.msas.list(-1, 0, -1); // No pagination limit
        setMsas(data.data);
      } catch (err) {
        console.error(err);
        setError('Error fetching MSAs');
        setSuccess(null);
      }
    };
    fetchMSAs();
  }, [id]);

  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      try {
        const data = await api.sows.get(id);
        updateDisplay(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load SOW data');
      }
    };
    fetchData();
  }, [id]);

  const updateDisplay = (data) => {
    setSowNumber(data.number);
    setMsaId(data.msa_id);
    setSowDocument(data.document);
    setStartDate(data.start_date);
    setEndDate(data.end_date);
    setBudget(data.budget);
    setMetadata(data.metadata ? JSON.stringify(data.metadata, null, 2) : '');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var data = {
        number: sowNumber,
        msa_id: msaId,
        start_date: startDate,
        end_date: endDate,
        budget: parseFloat(budget)
      };
      var updatedItem = await api.sows.update(id, data);

      updateDisplay(updatedItem);
      setSuccess('SOW updated successfully!');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to update SOW');
      setSuccess(null);
    }
  };

  const handleDeleteMilestone = async () => {
    try {
      await api.milestones.delete(milestoneToDelete);
      setSuccess('Milestone deleted successfully!');
      setError(null);
      setShowDeleteMilestoneModal(false);
      setReloadMilestones(true);
    } catch (err) {
      setSuccess(null);
      setError(err.message);
    }
  };
  
  const milestoneColumns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Due Date',
        accessor: 'due_date',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => {
          return (
            <div>
              <a href={`/milestones/${row.original.id}`} className="btn btn-link" aria-label="Edit">
                <i className="fas fa-edit"></i>
              </a>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setMilestoneToDelete(row.original.id);
                  setShowDeleteMilestoneModal(true);
                }}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const fetchMilestones = async () => {
    try {
      const data = await api.milestones.list(id, 0, -1); // No pagination limit
      return data;
    } catch (err) {
      console.error(err);
      setError('Error fetching milestones');
      setSuccess(null);
    }
  }

  return (
    <div>
      <h1>Edit SOW</h1>
      <hr/>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>MSA</Form.Label>
          <Form.Control
            as="select"
            value={msaId}
            onChange={(e) => setMsaId(e.target.value)}
            required
          >
            <option value="">Select MSA</option>
            {msas.map((msa) => (
              <option key={msa.id} value={msa.id}>
                {msa.title}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>SOW Number</Form.Label>
          <Form.Control
            type="text"
            value={sowNumber}
            onChange={(e) => setSowNumber(e.target.value)}
            required
          />
        </Form.Group>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Budget</Form.Label>
              <NumericFormat
                className="form-control"
                value={budget}
                thousandSeparator={true}
                prefix={'$'}
                onValueChange={(values) => {
                  const { value } = values;
                  setBudget(value);
                }}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Document</Form.Label>
              <div className="d-flex">
                <code>{sowDocument}</code>
                <a href={api.documents.getUrl(sowDocument)} target="_blank" rel="noreferrer">
                  <i className="fas fa-download ms-3"></i>
                </a>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Metadata</Form.Label>
          <Form.Control
            as="textarea"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            style={{ height: '8em' }}
            readOnly
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          <i className="fas fa-save"></i> Save
        </Button>
        <Button type="button" variant="secondary" className="ms-2" onClick={() => window.location.href = '/sows' }>
          <i className="fas fa-times"></i> Cancel
        </Button>
        <a href={`/msas/${msaId}`} className="btn btn-link ms-2">
          Go to MSA
        </a>
      </Form>

      <hr />

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h2 className="h2">Milestones</h2>
        <Button variant="primary" onClick={() => window.location.href = `/milestones/create/${id}`}>
          New Milestone <i className="fas fa-plus" />
        </Button>
      </div>

      <PagedTable columns={milestoneColumns}
        fetchData={fetchMilestones}
        reload={reloadMilestones}
        showPagination={false}
        />

      <ConfirmModal
        show={showDeleteMilestoneModal}
        handleClose={() => setShowDeleteMilestoneModal(false)}
        handleConfirm={handleDeleteMilestone}
        title="Delete Milestone"
        message="Are you sure you want to delete this milestone?"
      />
    </div>
  );
};

export default SOWEdit;