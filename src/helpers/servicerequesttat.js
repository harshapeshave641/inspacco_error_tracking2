import { msToDays, msToHumanReadable } from "./utils";

const visitStatuses = [
    'VISIT_DONE_CLIENT_ASKED_TO_WAIT',
    'VISIT_DONE_QUOTATION_PENDING',
    'QUOTATION_APPROVAL_PENDING',
    'REVISED_QUOTATION_PENDING',
    'QUOTATION_APPROVED',
    'WORK_DONE_INVOICE_PENDING',
    'INVOICE_ATTACHED_PAYMENT_PENDING',
    'PAYMENT_RECEIVED'
];

const quoteSubmissionStatuses = [
    'QUOTATION_APPROVAL_PENDING',
    'REVISED_QUOTATION_PENDING',
    'QUOTATION_APPROVED',
    'WORK_DONE_INVOICE_PENDING',
    'INVOICE_ATTACHED_PAYMENT_PENDING',
    'PAYMENT_RECEIVED'
];

const quoteApprovalStatuses = [
    'QUOTATION_APPROVED',
    'WORK_DONE_INVOICE_PENDING',
    'INVOICE_ATTACHED_PAYMENT_PENDING',
    'PAYMENT_RECEIVED'
];

const workCompletedStatuses = [
    'WORK_DONE_INVOICE_PENDING',
    'INVOICE_ATTACHED_PAYMENT_PENDING',
    'PAYMENT_RECEIVED'
];

export function calculateTAT(serviceRequest, statusHistory) {
    console.log('serviceRequest', serviceRequest)
    console.log('statusHistory', statusHistory)
    const createdAt = new Date(serviceRequest.createdAt);

    function getEarliestDate(statusList) {
        for (const status of statusList) {
            const statusEntry = statusHistory.find(entry => entry.status === status);
            if (statusEntry) {
                return new Date(statusEntry.date);
            }
        }
        return null
    }
    function getDateForStatus(status) {
        const statusEntry = statusHistory.find(entry => entry.status === status);
        if (statusEntry) {
            return new Date(statusEntry.date);
        }
        return null;
    }
    function getLatestDate(statusList) {
        for (const status of [...statusList].reverse()) {
            const statusEntry = statusHistory.find(entry => entry.status === status);
            if (statusEntry) {
                return new Date(statusEntry.date);
            }
        }
        return null
    }

    const earliestVisitStatusDate = getLatestDate(visitStatuses);
    const earliestQuoteSubmissionStatusDate = getLatestDate(quoteSubmissionStatuses);
    const earliestQuoteApprovalStatusDate = getLatestDate(quoteApprovalStatuses);
    const earliestWorkCompletedStatusDate = getEarliestDate(workCompletedStatuses);
    console.log('')
    //quoteApproaval  = earliestQuoate
    const tat = {
        visitTAT: earliestVisitStatusDate ? msToDays(earliestVisitStatusDate - createdAt) : null,
        quoteSubmissionTAT: earliestQuoteSubmissionStatusDate ? msToDays(earliestQuoteSubmissionStatusDate - createdAt) : null,
        quoteApprovalTAT: earliestQuoteApprovalStatusDate ? msToDays(earliestQuoteApprovalStatusDate - getDateForStatus('QUOTATION_APPROVAL_PENDING')) : null,
        workCompletedTAT: earliestWorkCompletedStatusDate ? msToDays(earliestWorkCompletedStatusDate - getDateForStatus('QUOTATION_APPROVED')) : null,
        visitCompleted: earliestVisitStatusDate !== null,
        quoteSubmitted: earliestQuoteSubmissionStatusDate !== null,
        workCompleted: earliestWorkCompletedStatusDate !== null,
        quoteApproved: earliestQuoteApprovalStatusDate !== null
    };
    Object.keys(tat).forEach(key => {
        if (key.endsWith('TAT') && tat[key] >= 1980) {
            tat[key] = 'N/A'
        }
    })
    return tat;
}

// Example usage
// const serviceRequest = {
//     createdAt: '2023-06-01T08:00:00Z',
//     status: 'VISIT_DONE_CLIENT_ASKED_TO_WAIT'
// };

// const statusHistory = [
//     { status: 'VISIT_SCHEDULED', date: '2023-06-02T10:00:00Z' },
//     { status: 'VISIT_DONE_CLIENT_ASKED_TO_WAIT', date: '2023-06-03T10:00:00Z' },
//     { status: 'QUOTATION_APPROVAL_PENDING', date: '2023-06-05T08:00:00Z' },
//     { status: 'QUOTATION_APPROVED', date: '2023-06-07T08:00:00Z' },
//     { status: 'WORK_DONE_INVOICE_PENDING', date: '2023-06-09T08:00:00Z' },
//     { status: 'INVOICE_ATTACHED_PAYMENT_PENDING', date: '2023-06-10T08:00:00Z' },
//     { status: 'PAYMENT_RECEIVED', date: '2023-06-12T08:00:00Z' }
// ];

// const tat = calculateTAT(serviceRequest, statusHistory);
// console.log(tat);
