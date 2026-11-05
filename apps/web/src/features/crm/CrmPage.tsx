import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { ArrowRight, Code, Users, Home } from 'lucide-react';

export function CrmPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="CRM Overview"
        description="Select the appropriate customer relationship pipeline for your active workspace."
      />

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <Link to="/app/crm/tech" className="group">
          <Card className="h-full hover:border-accent">
            <CardHeader className="flex items-center gap-2">
              <Code size={18} className="text-accent" />
              <h2 className="text-sm font-semibold text-ch-text-primary">Tech CRM</h2>
            </CardHeader>
            <CardBody>
              <p className="text-xs text-ch-text-secondary mb-4">
                Software development, web design, automation enquiries, and IT client accounts.
              </p>
              <span className="text-xs text-accent font-medium inline-flex items-center gap-1 group-hover:underline">
                Open pipeline <ArrowRight size={12} />
              </span>
            </CardBody>
          </Card>
        </Link>

        <Link to="/app/crm/real-estate/partners" className="group">
          <Card className="h-full hover:border-accent">
            <CardHeader className="flex items-center gap-2">
              <Users size={18} className="text-accent" />
              <h2 className="text-sm font-semibold text-ch-text-primary">RE Partners</h2>
            </CardHeader>
            <CardBody>
              <p className="text-xs text-ch-text-secondary mb-4">
                Developers, builders, landowners, channel partners, and brokers.
              </p>
              <span className="text-xs text-accent font-medium inline-flex items-center gap-1 group-hover:underline">
                Open pipeline <ArrowRight size={12} />
              </span>
            </CardBody>
          </Card>
        </Link>

        <Link to="/app/crm/real-estate/buyers" className="group">
          <Card className="h-full hover:border-accent">
            <CardHeader className="flex items-center gap-2">
              <Home size={18} className="text-accent" />
              <h2 className="text-sm font-semibold text-ch-text-primary">RE Buyers</h2>
            </CardHeader>
            <CardBody>
              <p className="text-xs text-ch-text-secondary mb-4">
                Flat buyer enquiries, site visit schedules, property matching, and conversion tracking.
              </p>
              <span className="text-xs text-accent font-medium inline-flex items-center gap-1 group-hover:underline">
                Open pipeline <ArrowRight size={12} />
              </span>
            </CardBody>
          </Card>
        </Link>
      </div>
    </div>
  );
}
