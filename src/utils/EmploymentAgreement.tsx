import React from "react";
import { useHighlightedText } from "../context/HighlightedTextContext";

// It is For Raw HTML string for Live_Generation
export const documentText = `
  <div id="document-preview" className="bg-white rounded-lg shadow-sm border border-black-100 p-8">
      <h1 className="text-blue-600 text-3xl font-bold mb-8 tracking-tight">
          EMPLOYMENT AGREEMENT
      </h1>
      <div className="text-blue-600 leading-relaxed space-y-6"> <!-- Added space-y-6 for consistent section spacing -->
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">PARTIES</h2>
              <p>
                  <strong>Employer:</strong> [Employer Name]*, a company incorporated
                  and registered in [Registered Address]*, State of California 
                  ("Company").
              </p>
              <p>
                  <strong>Employee:</strong> [Employee Name]*, residing at [Employee Address]* ("Employee").
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">COMMENCEMENT OF EMPLOYMENT</h2>
              <p>
                  The Employee’s employment with the Company shall commence on
                  [Employment Start Date]*. The Employee's period of continuous employment will begin on this date. 
                  
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">(PROBATIONARY PERIOD</h2><p>The first [Probation Period Length]* months of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. Upon successful completion, the Employee will be confirmed in their role. ){" "}<span className="text-black font-bold">(Optional Clause)</span></p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">JOB TITLE AND DUTIES</h2>
              <p>
                  The Employee shall be employed as [Job Title]* and shall report to
                  [Reporting Manager]*. The Employee's primary duties shall include [Brief Description of Duties]*. {The Employee may be required to
                  perform additional duties as reasonably assigned by the Company.}
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">PLACE OF WORK</h2>
              <p>
                 The Employee’s normal place of work is [Workplace Address]*.
                 </p>
                 <p>
{/The Employee may be required to work at [other locations]./}
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">WORKING HOURS</h2>
              <p>
                  The Employee’s normal working hours shall be [Start Time]* to [End Time]*, [Days of Work]*. The Employee may be required to work additional hours as necessary to fulfill job responsibilities.
                  <p className="mt-5" id="employment-agreement-working-hours">
                      {The Employee is entitled to overtime pay for authorized overtime work}  {The Employee shall not receive additional payment for overtime worked}.
                  </p>
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">REMUNERATION</h2>
              <p>
                  The Employee shall receive a salary of [Annual Salary]* [USD]* per [Payment Frequency]*, payable in arrears on or before [Payment Date]* by direct bank transfer. The Company reserves the right to deduct from the Employee’s salary any sums owed to the Company, including but not limited to, overpaid salary, outstanding loans, or loss/damage of Company property.
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">HOLIDAY ENTITLEMENT</h2>
              <p>
                 The Employee shall be entitled to [Holiday Entitlement]* days of paid annual leave per year, inclusive of public holidays. Unused leave may not be carried forward without prior approval. {Upon termination, unused leave will be paid. For [Unused Holiday Days] unused days, the holiday pay is [Holiday Pay] [USD].}
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">SICKNESS ABSENCE</h2>
              <p>
                If the Employee is unable to work due to illness, they must notify the Company as soon as possible. Statutory Sick Pay (SSP) will be paid in accordance with government regulations. {The Employee may also be entitled to Company sick pay.}
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">(PENSION</h2>
              <p>
                  The Employee will be enrolled in the Company’s pension scheme in accordance with auto-enrolment legislation.)
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">TERMINATION CLAUSE</h2>
              <p>
                 Either party may terminate the employment by providing [Notice Period]* days written notice. The Company reserves the right to make a payment in lieu of notice. The Company may summarily dismiss the Employee without notice in cases of gross misconduct.
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">CONFIDENTIALITY</h2>
              <p>
                  The Employee must not disclose any confidential information obtained during employment to any unauthorized person, both during and after employment.
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">DISCIPLINARY AND GRIEVANCE PROCEDURES</h2>
              <p>
                  The Employee is subject to the Company’s disciplinary and grievance procedures.
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">GOVERNING LAW</h2>
              <p>
                 This Agreement shall be governed by and construed in accordance with the laws of [USA]*. Any disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the courts of [USA]*.
              </p>
          </div>
          <div> <!-- Wrapper for each clause section -->
              <h2 className="text-2xl font-bold mt-6">SIGNED</h2>
              <p className="mb-3">
                  <strong>For and on behalf of the Company:</strong>
              </p>
              <p>Signature: ___________________________</p>
              <p>Name: [Authorized Representative]*</p>
              <p>Title: [Job Title of the authorized representative]*</p>
              <p className="mb-3">Date: [Date of signature]*</p>
              <p className="mb-3">
                  <strong>Employee:</strong>
              </p>
              <p>Signature: ___________________________</p>
              <p>Name: [Employee Name]*</p>
              <p>Date: [Date of signing by Employee]*</p>
          </div>
      </div>
  </div>
`;

// and this is for JSX component for LevelTwoPart_Two
const EmploymentAgreement: React.FC = () => {
  useHighlightedText();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-black-100 p-8">
      <h1 className="text-blue-600 text-3xl font-bold mb-8 tracking-tight">
        EMPLOYMENT AGREEMENT
      </h1>
      <div className="text-blue-600 leading-relaxed">
        <h2 className="text-2xl font-bold">PARTIES</h2>
        <p id="employer-name-placeholder">
          <strong>Employer:</strong> [Employer Name]*, a company incorporated
          and registered in [Registered Address]*, State of California
          ("Company").
        </p>
        <p>
          <strong>Employee:</strong> [Employee Name]*, residing at [Employee
          Address]* ("Employee").
        </p>

        <h2 className="text-2xl font-bold mt-6">COMMENCEMENT OF EMPLOYMENT</h2>
        <p>
          The Employee’s employment with the Company shall commence on
          [Employment Start Date]*. The Employee's period of continuous
          employment will begin on this date.
        </p>

        <h2 className="text-2xl font-bold mt-6">(PROBATIONARY PERIOD</h2>
        <p>
          The first [Probation Period Length]* of employment will be a
          probationary period. The Company shall assess the Employee’s
          performance and suitability during this time. Upon successful
          completion, the Employee will be confirmed in their role.){" "}
          <span className="text-black font-bold">(Optional Clause)</span>
        </p>

        <h2 className="text-2xl font-bold mt-6">JOB TITLE AND DUTIES</h2>
        <p>
          The Employee shall be employed as [Job Title]* and shall report to
          [Reporting Manager]*. The Employee's primary duties shall include
          [Brief Description of Duties]*.{"{"}The Employee may be required to
          perform additional duties as reasonably assigned by the Company.{"}"}
        </p>

        <h2 className="text-2xl font-bold mt-6">PLACE OF WORK</h2>
        <p>The Employee’s normal place of work is [Workplace Address]*.</p>
        <p>
          {"{"}/The Employee may be required to work at [other locations]./{"}"}
        </p>

        <h2 className="text-2xl font-bold mt-6">WORKING HOURS</h2>
        <p>
          The Employee’s normal working hours shall be [Start Time]* to [End
          Time]*, [Days of Work]*. The Employee may be required to work
          additional hours as necessary to fulfill job responsibilities.
          <p className="mt-5">
            {"{"}The Employee is entitled to overtime pay for authorized
            overtime work{"}"} {"{"}The Employee shall not receive additional
            payment for overtime worked{"}"}.
          </p>
        </p>

        <h2 className="text-2xl font-bold mt-6">REMUNERATION</h2>
        <p>
          The Employee shall receive a salary of £[Annual Salary]* [USD]* per
          [Payment Frequency]*, payable in arrears on or before [Payment Date]*
          by direct bank transfer. The Company reserves the right to deduct from
          the Employee’s salary any sums owed to the Company, including but not
          limited to, overpaid salary, outstanding loans, or loss/damage of
          Company property.
        </p>

        <h2 className="text-2xl font-bold mt-6">HOLIDAY ENTITLEMENT</h2>
        <p>
          The Employee shall be entitled to [Holiday Entitlement]* days of paid
          annual leave per year, inclusive of public holidays. Unused leave may
          not be carried forward without prior approval. {"{"}Upon termination,
          unused leave will be paid. For [Unused Holiday Days] unused days, the
          holiday pay is [Holiday Pay] [USD].{"}"}
        </p>

        <h2 className="text-2xl font-bold mt-6">SICKNESS ABSENCE</h2>
        <p>
          If the Employee is unable to work due to illness, they must notify the
          Company as soon as possible. Statutory Sick Pay (SSP) will be paid in
          accordance with government regulations. {"{"}The Employee may also be
          entitled to Company sick pay.{"}"}
        </p>

        <h2 className="text-2xl font-bold mt-6">(PENSION</h2>
        <p>
          The Employee will be enrolled in the Company’s pension scheme in
          accordance with auto-enrolment legislation.)
        </p>

        <h2 className="text-2xl font-bold mt-6">TERMINATION CLAUSE</h2>
        <p>
          Either party may terminate the employment by providing [Notice
          Period]* days written notice. The Company reserves the right to make a
          payment in lieu of notice. The Company may summarily dismiss the
          Employee without notice in cases of gross misconduct.
          <span className="text-black font-bold">(Optional Clause)</span>
        </p>

        <h2 className="text-2xl font-bold mt-6">CONFIDENTIALITY</h2>
        <p>
          The Employee must not disclose any confidential information obtained
          during employment to any unauthorized person, both during and after
          employment.
        </p>

        <h2 className="text-2xl font-bold mt-6">
          DISCIPLINARY AND GRIEVANCE PROCEDURES
        </h2>
        <p>
          The Employee is subject to the Company’s disciplinary and grievance
          procedures.
        </p>

        <h2 className="text-2xl font-bold mt-6">GOVERNING LAW</h2>
        <p>
          This Agreement shall be governed by and construed in accordance with
          the laws of [USA]*. Any disputes arising from this Agreement shall be
          subject to the exclusive jurisdiction of the courts of [USA]*.
        </p>

        <h2 className="text-2xl font-bold mt-6">SIGNED</h2>
        <p className="mb-3">
          <strong>For and on behalf of the Company:</strong>
        </p>
        <p>Signature: ___________________________</p>
        <p>Name: [Authorized Representative]*</p>
        <p>Title: [Job Title of the authorized representative]*</p>
        <p className="mb-3">Date: [Date of signature]*</p>
        <p className="mb-3">
          <strong>Employee:</strong>
        </p>
        <p>Signature: ___________________________</p>
        <p>Name: [Employee Name]*</p>
        <p>Date: [Date of signing by Employee]*</p>
      </div>
    </div>
  );
};

export default EmploymentAgreement;

// original
