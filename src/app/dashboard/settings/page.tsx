'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import { Bell, Globe, Shield, Mail } from 'lucide-react'

export default function SettingsPage() {
  const [notifyOnReview, setNotifyOnReview] = useState(true)
  const [publicProfile, setPublicProfile] = useState(true)
  const [emailDigest, setEmailDigest] = useState('daily')
  const [saveMessage, setSaveMessage] = useState('')

  const handleSave = () => {
    setSaveMessage('Settings saved successfully!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-600">
            Manage your account preferences and configurations
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">New Review Alerts</h3>
                  <p className="text-sm text-gray-500">Get notified when you receive a new review</p>
                </div>
                <button
                  onClick={() => setNotifyOnReview(!notifyOnReview)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    notifyOnReview ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Enable notifications</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      notifyOnReview ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900">Email Digest</label>
                <select
                  value={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">Privacy</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Public Profile</h3>
                  <p className="text-sm text-gray-500">Make your business profile visible in the directory</p>
                </div>
                <button
                  onClick={() => setPublicProfile(!publicProfile)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    publicProfile ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Enable public profile</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      publicProfile ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* API Integration (Future Feature) */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">API Integration</h2>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-500">
                API integration features coming soon. You'll be able to connect various review platforms
                and automate review collection.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            {saveMessage && (
              <span className="text-sm text-green-600">{saveMessage}</span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}