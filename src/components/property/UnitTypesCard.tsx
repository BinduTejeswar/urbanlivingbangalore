interface UnitTypeRow {
  _key: string
  type: string
  monthlyRent: number
  depositAmount: number
}

interface UnitTypesCardProps {
  unitTypes?: UnitTypeRow[]
}

export default function UnitTypesCard({ unitTypes }: UnitTypesCardProps) {
  if (!unitTypes || unitTypes.length === 0) return null

  return (
    <section className="rounded-[2rem] border border-[#DDE8DD] bg-[#FFFFFF] p-5 shadow-xl shadow-slate-900/5 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            Configurations
          </p>
          <h2 className="text-2xl font-black tracking-tighter text-[#1C1008] sm:text-3xl">
            Available Unit Types
          </h2>
        </div>
        <span className="rounded-full border border-[#DDE8DD] bg-[#F6F8F4] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
          {unitTypes.length} options
        </span>
      </div>

      <div className="divide-y divide-[#EDE6DB]">
        {unitTypes.map((unit) => (
          <div key={unit._key} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
            <span className="rounded-lg bg-[#FBEAE0] px-2.5 py-1 text-[11px] font-black text-primary">
              {unit.type}
            </span>
            <span className="text-lg font-black tracking-tight text-[#1C1008]">
              ₹{unit.monthlyRent.toLocaleString('en-IN')}
              <span className="ml-1 text-[10px] font-bold text-slate-400">/ mo</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              Deposit ₹{unit.depositAmount.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
