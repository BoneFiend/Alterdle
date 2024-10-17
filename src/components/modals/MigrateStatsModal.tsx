import { useState } from 'react'

import { EmigratePanel } from '@ui/stats/EmigratePanel'
import { ImmigratePanel } from '@ui/stats/ImmigratePanel'

import useModalStore, { updateModals } from '@stores/useModalStore'

import { BaseModal } from './BaseModal'

export const MigrateStatsModal = () => {
  const isMigrateStatsModalOpen = useModalStore(
    (s) => s.modals.isMigrateStatsModalOpen,
  )

  const [isEmigrateVisible, setIsEmigrateVisible] = useState(true)

  const handleClose = () => {
    updateModals({
      isAdvancedSettingsModalOpen: true,
      isMigrateStatsModalOpen: false,
    })
  }

  return (
    <BaseModal
      title="Transfer your statistics"
      isOpen={isMigrateStatsModalOpen}
      handleClose={handleClose}
    >
      <p className="mb-4 mt-4 text-sm text-secondary">
        Copy the migration code on your old device and paste into the input on
        the new device.
      </p>

      <div className="mb-3 w-full columns-3 gap-0">
        <div className="mb-4 flex items-center">
          <p className="mb-0 flex text-sm font-medium text-secondary">
            This is my:
          </p>
        </div>
        <div className="mb-4 flex items-center">
          <input
            checked={isEmigrateVisible}
            onChange={() => setIsEmigrateVisible(true)}
            id="emigrate-radio-button"
            radioGroup="migrate-radio-buttons"
            type="radio"
            value=""
            name="emigrate-radio-button"
            className="h-4 w-4 text-accent focus:ring-2 focus:ring-accent focus:ring-offset-primary-2"
          />
          <label
            htmlFor="emigrate-radio-button"
            className="ml-2 text-sm font-medium text-blank"
          >
            old device
          </label>
        </div>
        <div className="flex items-center">
          <input
            checked={!isEmigrateVisible}
            onChange={() => setIsEmigrateVisible(false)}
            id="immigrate-radio-button"
            radioGroup="migrate-radio-buttons"
            type="radio"
            value=""
            name="immigrate-radio-button"
            className="h-4 w-4 text-accent focus:ring-2 focus:ring-accent focus:ring-offset-primary-2"
          />
          <label
            htmlFor="immigrate-radio-button"
            className="ml-2 text-sm font-medium text-blank"
          >
            new device
          </label>
        </div>
      </div>

      {isEmigrateVisible && <EmigratePanel />}
      {!isEmigrateVisible && <ImmigratePanel />}
    </BaseModal>
  )
}
