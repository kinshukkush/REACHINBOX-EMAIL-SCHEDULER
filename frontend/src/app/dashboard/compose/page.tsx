"use client"
import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ComposePage() {
    const router = useRouter();
    const [recipients, setRecipients] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [startTime, setStartTime] = useState('');
    const [delayBetweenEmails, setDelayBetweenEmails] = useState('2000');
    const [hourlyLimit, setHourlyLimit] = useState('200');
    const [senderEmail, setSenderEmail] = useState('oliver.brown@domain.io');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
                if (emails) {
                    setRecipients(Array.from(new Set(emails)));
                }
            };
            reader.readAsText(file);
        }
    };

    const handleSchedule = async () => {
        if (!subject || !body || recipients.length === 0 || !startTime) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/emails/schedule`, {
                subject,
                body,
                recipients,
                startTime: new Date(startTime).toISOString(),
                delayBetweenEmails: parseInt(delayBetweenEmails),
                hourlyLimit: parseInt(hourlyLimit),
                senderEmail
            });

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Failed to schedule emails:', error);
            alert('Failed to schedule emails. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col pt-4">
            <div className="px-8 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
                    <h1 className="text-xl font-semibold">Compose New Email</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleSchedule}
                        disabled={loading || success}
                        className="px-6 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {success ? <><CheckCircle size={16} /> Scheduled!</> : loading ? 'Scheduling...' : 'Schedule Emails'}
                    </button>
                </div>
            </div>

            <div className="px-32 flex-1 relative">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 w-24">From</span>
                        <select 
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                            className="bg-gray-50 px-3 py-1.5 rounded-lg border-none outline-none text-sm font-medium"
                        >
                            <option value="oliver.brown@domain.io">oliver.brown@domain.io</option>
                            <option value="sender2@domain.io">sender2@domain.io</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4 group">
                            <span className="text-gray-400 w-24">To</span>
                            <input
                                type="text"
                                placeholder="recipient@example.com"
                                value={recipients.join(', ')}
                                onChange={(e) => setRecipients(e.target.value.split(',').map(s => s.trim()))}
                                className="flex-1 outline-none border-b border-transparent focus:border-gray-100 py-1"
                            />
                            <label className="text-green-600 text-sm font-medium cursor-pointer hover:underline flex items-center gap-1">
                                <Send size={14} className="-rotate-45" /> Upload List
                                <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
                            </label>
                        </div>
                        {recipients.length > 0 && (
                            <div className="ml-28 text-xs text-gray-400">
                                {recipients.length} recipients detected
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 w-24">Subject</span>
                        <input 
                            type="text" 
                            placeholder="Subject" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 outline-none border-b border-transparent focus:border-gray-100 py-1" 
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 w-24">Start Time</span>
                        <input 
                            type="datetime-local" 
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 outline-none text-sm" 
                        />
                    </div>

                    <div className="flex items-center gap-8 border-t border-gray-50 pt-6">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm">Delay between emails (ms)</span>
                            <input 
                                type="number" 
                                value={delayBetweenEmails}
                                onChange={(e) => setDelayBetweenEmails(e.target.value)}
                                placeholder="2000" 
                                className="w-24 h-10 bg-gray-50 rounded-lg text-center outline-none border border-gray-100" 
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm">Hourly Limit</span>
                            <input 
                                type="number" 
                                value={hourlyLimit}
                                onChange={(e) => setHourlyLimit(e.target.value)}
                                placeholder="200" 
                                className="w-24 h-10 bg-gray-50 rounded-lg text-center outline-none border border-gray-100" 
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <textarea
                            placeholder="Type your email content..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full h-64 outline-none resize-none text-gray-600 leading-relaxed border border-gray-100 rounded-lg p-4"
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}
