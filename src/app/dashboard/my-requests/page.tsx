'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BloodGroupBadge, StatusBadge, UrgencyBadge } from '@/components/ui/Badges';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { BloodRequest, RequestStatus } from '@/types';
import {
  PlusCircle,
  CheckCircle,
  XCircle,
  Eye,
  Users,
  Phone,
  Calendar,
  Building2,
  Edit2,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export default function MyRequestsPage() {
  const {
    user,
    requests,
    updateRequestStatus,
    editRequest,
    cancelRequest,
    setCreateModalOpen,
    setActiveDetailRequest,
  } = usePlatform();

  // Active modal state for Editing a request
  const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(null);
  const [editUnits, setEditUnits] = useState('1');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Active modal state for Viewing Contacted Donors
  const [viewingDonorsReq, setViewingDonorsReq] = useState<BloodRequest | null>(null);

  if (!user) return null;

  // Filter requests that belong to user
  const myRequests = requests.filter(
    (req) => req.requesterId === user.id || req.requesterName === user.name
  );

  const openEdit = (req: BloodRequest) => {
    setEditingRequest(req);
    setEditUnits(req.units.toString());
    setEditTime(req.requiredTime);
    setEditNotes(req.additionalInfo || '');
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;
    editRequest(editingRequest.id, {
      units: parseInt(editUnits) || 1,
      requiredTime: editTime,
      additionalInfo: editNotes,
    });
    setEditingRequest(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-ui-border">
          <div>
            <div className="flex items-center gap-2 text-12 font-bold text-brand-primary uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              Requester Management
            </div>
            <h1 className="text-24 sm:text-32 font-bold text-ink-primary tracking-tight">
              My Posted Blood Requests
            </h1>
            <p className="text-14 text-ink-secondary mt-1">
              Manage your urgent requirements, review donors who reached out, or mark cases as fulfilled.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create New Request
          </Button>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {myRequests.map((req) => (
            <Card key={req.id} padding="none" className="overflow-hidden">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <BloodGroupBadge group={req.bloodGroup} size="lg" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-18 font-bold text-ink-primary">
                        {req.bloodGroup} · {req.units} {req.units > 1 ? 'Units' : 'Unit'} Needed
                      </h3>
                      <UrgencyBadge urgency={req.urgency} />
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-12 text-ink-secondary">
                      <span className="flex items-center gap-1 font-semibold text-ink-primary">
                        <Building2 className="w-3.5 h-3.5 text-brand-primary" />
                        {req.hospitalName} ({req.hospitalLocation})
                      </span>
                      <span>·</span>
                      <span>Patient: <strong>{req.patientName}</strong> ({req.patientRelation})</span>
                      <span>·</span>
                      <span>Required: <strong>{req.requiredDate} {req.requiredTime}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Donors contacted count button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewingDonorsReq(req)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-ui-bg border border-ui-border hover:border-brand-primary/50 text-ink-primary text-12 font-semibold transition-colors"
                  >
                    <Users className="w-4 h-4 text-brand-primary" />
                    <span>{req.contactedDonors?.length || req.responsesCount || 0} Donors Responded</span>
                  </button>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="px-5 py-3 bg-ui-bg/70 border-t border-ui-border flex flex-wrap items-center justify-between gap-2">
                <span className="text-12 text-ink-muted">Posted {req.createdAt}</span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setActiveDetailRequest(req)}
                  >
                    View
                  </Button>

                  {req.status === 'Active' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                        onClick={() => openEdit(req)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="success"
                        size="sm"
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        onClick={() => updateRequestStatus(req.id, 'Fulfilled')}
                      >
                        Mark Fulfilled
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-semantic-error hover:bg-semantic-error-subtle"
                        onClick={() => cancelRequest(req.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

      {/* Edit Request Modal */}
      {editingRequest && (
        <Modal
          isOpen={!!editingRequest}
          onClose={() => setEditingRequest(null)}
          title="Edit Blood Request"
          description={`Update details for ${editingRequest.patientName} at ${editingRequest.hospitalName}`}
          maxWidth="md"
        >
          <form onSubmit={saveEdit} className="space-y-4">
            <Input
              label="Required Units"
              type="number"
              min="1"
              max="10"
              value={editUnits}
              onChange={(e) => setEditUnits(e.target.value)}
              requiredIndicator
            />
            <Input
              label="Required Time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              requiredIndicator
            />
            <div>
              <label className="block text-14 font-semibold text-ink-primary mb-1">
                Clinical / Ward Notes
              </label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full p-3 text-14 text-ink-primary bg-ui-surface border border-ui-border rounded-md"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-ui-border">
              <Button variant="ghost" type="button" onClick={() => setEditingRequest(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Contacted Donors Modal */}
      {viewingDonorsReq && (
        <Modal
          isOpen={!!viewingDonorsReq}
          onClose={() => setViewingDonorsReq(null)}
          title="Donors Who Reached Out"
          description={`Volunteers who initiated contact for ${viewingDonorsReq.bloodGroup} blood at ${viewingDonorsReq.hospitalName}`}
          maxWidth="md"
        >
          <div className="space-y-3">
            {viewingDonorsReq.contactedDonors && viewingDonorsReq.contactedDonors.length > 0 ? (
              viewingDonorsReq.contactedDonors.map((cd) => (
                <div
                  key={cd.id}
                  className="p-3 bg-ui-bg rounded-lg border border-ui-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-brand-light text-brand-primary font-bold flex items-center justify-center text-12">
                      {cd.donorName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-14 font-bold text-ink-primary">{cd.donorName}</p>
                      <p className="text-12 text-ink-secondary">{cd.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-12 text-ink-muted block">{cd.timestamp}</span>
                    <a
                      href={`tel:${cd.phone}`}
                      className="text-12 font-bold text-brand-primary hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" /> Call Back
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-ink-secondary">
                <Users className="w-8 h-8 text-ink-muted mx-auto mb-2" />
                <p className="text-14 font-medium text-ink-primary">No Direct Donors Yet</p>
                <p className="text-12 mt-1">Donors will appear here as soon as they view and tap your contact details.</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

