# CORVIIN HUB — Real Estate Developers & Partners CRM Specification

**Document ID:** CH-FS-12 | **Version:** 1.0

## 1. Purpose

Manage developer, builder and other business relationships for Corviin Real Estate, from initial prospecting through meetings, proposal, negotiation and active partnership.

## 2. Partner types

- Developer
- Builder
- Construction company
- Landowner
- Channel partner
- Broker/agent
- Other partner

## 3. Landing page

Desktop table:
- Company/partner
- Contact person
- Partner type
- Location
- Projects
- Partnership stage
- Assigned member
- Next follow-up

Mobile card:
- Company name
- Contact person/phone
- Partner type/location
- Stage
- Next follow-up
- Call / Message / Open

Filters:
- Partner type
- Stage
- Assigned member
- Location
- Project
- Source
- Follow-up due

## 4. Create partner form

Required essentials:
- Company/partner name
- Contact person (if known)
- Phone/contact method
- Partner type
- Assigned member

Optional:
- Email
- Location
- Website
- Project names/locations
- Marketing/service requirements
- Partnership interest
- Source
- Notes
- Documents

Allow partial records when details are not yet known.

## 5. Pipeline

1. New Partner Lead
2. Initial Contact
3. Meeting Planned
4. Requirement Discussion
5. Proposal / Service Details
6. Follow-up / Negotiation
7. Partnership Confirmed
8. Active Partner

Alternative outcomes:
- Not Interested
- Lost
- Follow Up Later

A stage change must be logged with actor and timestamp. Follow Up Later must have a next-action date when the workflow requires it.

## 6. Partner detail page

Sections:
- Overview
- Company/contact details
- Partner type and location
- Projects
- Requirements and services
- Partnership status
- Interactions
- Meetings and decisions
- Campaigns
- Tasks/follow-ups
- Documents
- Activity history

## 7. Multiple projects

One developer/partner may relate to multiple projects. Model project relationships separately rather than storing one comma-separated project string. Each project may link to campaigns, assets, meetings and tasks.

If a full Projects module is not in initial scope, use a controlled project reference entity/table rather than unstructured text wherever practical.

## 8. Meeting and proposal workflow

- Schedule meeting from partner record.
- Prelink partner and relevant project.
- Record agenda, requirements, decisions and commitments.
- Convert action items to tasks.
- Link proposal/service details and supporting documents.
- Record follow-up and negotiation outcome.
- Mark partnership confirmed/active only when explicitly confirmed.

## 9. Reporting

- Partner leads by type/source.
- Pipeline stage counts.
- Meetings planned/completed.
- Follow-ups due/overdue.
- Active partners.
- Projects per partner.

## 10. Mobile UX

- Quick partner creation.
- Call/message actions.
- Project list as compact chips/list.
- Meeting schedule action.
- Short notes and follow-up entry.
- Long requirements and documents in collapsible sections.

## 11. Acceptance criteria

- [ ] Partner types and partner pipeline are supported.
- [ ] Partner records link to multiple projects/campaigns.
- [ ] Meetings and action items remain linked.
- [ ] Follow-up owner/date are visible.
- [ ] Mobile quick actions are prominent.
