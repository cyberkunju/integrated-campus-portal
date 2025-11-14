// Receipt Generator Utility
// Generates PDF receipts for fee payments using jsPDF directly
import jsPDF from 'jspdf'

export const generateReceipt = async (payment, student) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  // Colors
  const primaryColor = [0, 0, 0]
  const secondaryColor = [100, 100, 100]
  const accentColor = [52, 152, 219]
  
  let yPos = 20
  
  // Header
  pdf.setFillColor(0, 0, 0)
  pdf.rect(0, 0, 210, 40, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('UNIVERSITY NAME', 105, 15, { align: 'center' })
  
  pdf.setFontSize(16)
  pdf.text('Fee Payment Receipt', 105, 25, { align: 'center' })
  
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Address Line 1, City, State - PIN Code', 105, 32, { align: 'center' })
  pdf.text('Phone: +91-XXXXXXXXXX | Email: info@university.edu', 105, 37, { align: 'center' })
  
  yPos = 50
  
  // Receipt Title
  pdf.setFillColor(0, 0, 0)
  pdf.rect(15, yPos, 180, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('OFFICIAL FEE RECEIPT', 105, yPos + 7, { align: 'center' })
  
  yPos += 20
  
  // Receipt Details
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  
  const addDetail = (label, value) => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(label, 20, yPos)
    pdf.setFont('helvetica', 'normal')
    pdf.text(value, 80, yPos)
    pdf.line(20, yPos + 2, 190, yPos + 2)
    yPos += 8
  }
  
  addDetail('Receipt No:', `RCP${Date.now()}`)
  addDetail('Date:', new Date(payment.paidAt || new Date()).toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }))
  addDetail('Student Name:', student.full_name)
  addDetail('Admission No:', student.student_id || 'N/A')
  addDetail('Course:', `${student.department}${student.semester ? ` - Semester ${student.semester}` : ''}`)
  addDetail('Payment Method:', payment.paymentMethod || 'Online')
  
  yPos += 5
  
  // Amount Section
  pdf.setFillColor(245, 245, 245)
  pdf.rect(15, yPos, 180, 35, 'F')
  pdf.setDrawColor(0, 0, 0)
  pdf.rect(15, yPos, 180, 35, 'S')
  
  yPos += 8
  
  pdf.setFont('helvetica', 'normal')
  pdf.text('Fee Type:', 20, yPos)
  pdf.text(payment.description, 80, yPos)
  yPos += 8
  
  pdf.text('Amount:', 20, yPos)
  pdf.text(`₹${payment.amount.toLocaleString('en-IN')}`, 80, yPos)
  yPos += 8
  
  if (payment.fineAmount) {
    pdf.text('Fine:', 20, yPos)
    pdf.text(`₹${payment.fineAmount.toLocaleString('en-IN')}`, 80, yPos)
    yPos += 8
  }
  
  // Total
  pdf.setLineWidth(0.5)
  pdf.line(20, yPos, 190, yPos)
  yPos += 8
  
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.text('Total Amount Paid:', 20, yPos)
  pdf.text(`₹${(payment.amount + (payment.fineAmount || 0)).toLocaleString('en-IN')}`, 80, yPos)
  
  yPos += 15
  
  // Amount in Words
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Amount in Words:', 20, yPos)
  pdf.setFont('helvetica', 'normal')
  const amountInWords = numberToWords(payment.amount + (payment.fineAmount || 0))
  pdf.text(`${amountInWords} Rupees Only`, 20, yPos + 6)
  
  // Generate filename
  const filename = `Receipt_${payment.description.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`
  
  // Download the PDF
  pdf.save(filename)
}

// Helper function to convert number to words
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  
  if (num === 0) return 'Zero'
  
  function convertLessThanThousand(n) {
    if (n === 0) return ''
    
    if (n < 10) return ones[n]
    if (n < 20) return teens[n - 10]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
    
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '')
  }
  
  if (num < 1000) return convertLessThanThousand(num)
  if (num < 100000) {
    return convertLessThanThousand(Math.floor(num / 1000)) + ' Thousand' + 
           (num % 1000 !== 0 ? ' ' + convertLessThanThousand(num % 1000) : '')
  }
  if (num < 10000000) {
    return convertLessThanThousand(Math.floor(num / 100000)) + ' Lakh' + 
           (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '')
  }
  
  return 'Amount Too Large'
}
