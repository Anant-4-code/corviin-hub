# CORVIIN HUB — Real Estate Buyers & Property Customers CRM Specification

**Document ID:** CH-FS-13 | **Version:** 1.0

## 1. Purpose

Manage property enquiries and buyer relationships from first enquiry through requirement capture, property sharing, site visits, follow-up and booking/conversion.

## 2. Landing page

Desktop columns:
- Buyer name
- Phone
- Requirement summary
- Preferred locality
- Budget
- Preferred project
- Pipeline stage
- Assigned member
- Next follow-up

Mobile cards:
- Buyer name and phone
- Configuration/locality
- Budget range if provided
- Stage
- Follow-up due
- Call / Message / Open

Filters:
- Stage
- Assigned member
- Locality
- Property type/configuration
- Budget range
- Timeline
- Preferred project
- Source/campaign
- Site visit status
- Follow-up due

## 3. Create buyer form

### Required essentials
- Customer name
- Phone/contact method
- Assigned member
- Enquiry source

### Optional/progressive details
- Email
- Preferred contact method
- Locality
- Property type
- Configuration: 1 BHK / 2 BHK / 3 BHK / other
- Budget range
- Buying timeline
- Purpose, if volunteered
- Preferred project/property
- Source campaign
- Notes

Do not force users to complete every requirement during first contact. The form should support a minimal lead record and progressive enrichment.

## 4. Buyer pipeline

1. New Enquiry
2. Contact Pending
3. Contacted
4. Requirement Captured
5. Qualified Buyer
6. Project / Property Shared
7. Site Visit Planned
8. Site Visit Completed
9. Follow-up / Discussion
10. Booking / Converted

Alternative outcomes:
- Not Interested
- Lost
- Follow Up Later

Allow an authorised user to correct a stage with an audit entry. Do not delete earlier stage history.

## 5. Buyer detail page

Header:
- Buyer name
- Phone
- Stage
- Assigned member
- Next follow-up

Quick actions:
- Call
- Message
- Add note
- Schedule follow-up
- Schedule site visit
- Share/add property reference (if sharing integration is not implemented, record the shared project/property manually)

Sections:
1. Contact details
2. Requirement
3. Budget and timeline
4. Preferred locality/project
5. Shared properties/projects
6. Site visit history
7. Interactions
8. Follow-ups and tasks
9. Documents
10. Activity history

## 6. Site visit workflow

Site visit is a separate linked record.

Fields:
- Buyer
- Project/property
- Visit date/time
- Location
- Responsible member
- Confirmation status
- Visit status: Planned, Confirmed, Completed, Cancelled, No Show
- Outcome/feedback
- Objections/questions
- Next follow-up
- Attachments/photos where permitted

Workflow:
1. Create visit from buyer record.
2. Select project/property and schedule.
3. Assign responsible member.
4. Confirm with buyer and update confirmation state.
5. Complete visit and record feedback.
6. Create next follow-up/task.
7. Buyer timeline shows visit and outcome.

## 7. Follow-up behaviour

Follow-up should be a structured record with owner, due date/time, status and optional linked task. The buyer record must prominently show the next follow-up. Overdue follow-ups should appear on dashboard and CRM filters.

## 8. Duplicate handling

Warn on likely duplicate phone/email within the workspace. Allow opening existing buyer record. Do not auto-merge or discard data.

## 9. Reporting

- New buyers by source/campaign.
- Buyers by pipeline stage.
- Requirement captured rate.
- Site visits planned/completed/no-show.
- Follow-ups due/overdue.
- Booking/conversion count.
- Demand by locality/configuration/budget only where data is sufficiently complete.

Do not report inferred buyer intent or sensitive personal characteristics.

## 10. Mobile UX

This is a high-frequency mobile workflow:
- Search by phone/name.
- Call/message one tap.
- Update stage quickly.
- Add note in a short composer.
- Schedule follow-up without leaving the record.
- Schedule site visit with a compact date/time/property form.
- Keep next follow-up visible.
- Use expandable requirement fields.

## 11. Acceptance criteria

- [ ] Buyer record has distinct fields and pipeline from partner CRM.
- [ ] Minimal buyer can be created with essential details.
- [ ] Site visits are linked records.
- [ ] Visit outcomes and next follow-ups are retained.
- [ ] Mobile supports quick contact and stage updates.
