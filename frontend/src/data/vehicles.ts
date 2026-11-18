export type CutType = 'full' | 'chassis'
export type CutKind = 'chassis' | 'full'
export type StatusTone = 'amber' | 'emerald' | 'blue' | 'indigo' | 'slate'
export type IdType = 'pan' | 'aadhaar'

export interface MediaItem {
  id: string
  kind: 'image' | 'video'
  url: string
  name: string
  addedAt: string // ISO
  tag?: string // e.g. "Chassis cut" for proof videos
}

export interface Note {
  id: string
  text: string
  author: string
  createdAt: string // ISO
}

export interface CutRecord {
  date: string // ISO
  videoId: string // MediaItem.id of the proof video
}

export interface OwnerDocs {
  rcNumber: string
  rcImage?: string
  idType: IdType
  idNumber: string
  idImage?: string
}

export interface Vehicle {
  jobId: string
  name: string
  plate: string
  vin: string
  godown: string // godown key, e.g. "g07"
  bay: string
  cutType: CutType
  inward: string // ISO datetime
  status: { label: string; tone: StatusTone; pulse?: boolean }
  media: MediaItem[]
  notes: Note[]
  chassisCut?: CutRecord
  fullCut?: CutRecord
  owner: OwnerDocs
}

export const CURRENT_USER = 'Y. K. Rathore'

export const CUT_LABEL: Record<CutKind, string> = {
  chassis: 'Chassis cut',
  full: 'Full cut',
}

export const GODOWNS: Record<string, string> = {
  g07: 'Godown #07 - Sector 4',
  g04: 'Godown #04 - Pune Central',
  g01: 'Godown #01 - North Sector',
  g12: 'Godown #12 - South Yard',
}

type Seed = Omit<Vehicle, 'media' | 'notes' | 'owner'>

const done = { label: 'Completed', tone: 'emerald' } as const

const SEED: Seed[] = [
  { jobId: 'SCR-88491', name: '2016 Hyundai Creta 1.6 CRDi', plate: 'DL-03-CC-1904', vin: 'MALC381CLHM894102', godown: 'g07', bay: 'Bay 03 (Heavy Hydraulic)', cutType: 'full', inward: '2024-10-24T11:23', status: { label: 'Shearing in Progress', tone: 'amber', pulse: true } },
  { jobId: 'SCR-88489', name: '2014 Honda City 1.5 i-VTEC', plate: 'MH-12-DE-4412', vin: 'MAKGM2657EN204918', godown: 'g04', bay: 'Bay 02 (Segmenting)', cutType: 'chassis', inward: '2024-10-23T16:15', status: done },
  { jobId: 'SCR-88487', name: '2012 Toyota Fortuner 4x4', plate: 'HR-26-BR-0099', vin: 'MBJ11KV4008291041', godown: 'g01', bay: 'Bay 01 (Compaction Cell)', cutType: 'full', inward: '2024-10-22T09:40', status: done },
  { jobId: 'SCR-88485', name: '2019 Tata Nexon EV (XZ+)', plate: 'MH-14-GH-6721', vin: 'MAT621124KNA99104', godown: 'g04', bay: 'Bay 04 (Battery Safe)', cutType: 'chassis', inward: '2024-10-22T14:10', status: { label: 'Battery Isolated', tone: 'blue' } },
  { jobId: 'SCR-88482', name: '2017 Maruti Swift Dzire VXi', plate: 'UP-16-AB-9832', vin: 'MA3FKB22S00918234', godown: 'g07', bay: 'Bay 03 (Shearing/Balers)', cutType: 'full', inward: '2024-10-21T10:15', status: { label: 'Compaction Ready', tone: 'indigo' } },
  { jobId: 'SCR-88478', name: '2015 Mahindra Scorpio S10', plate: 'KA-05-MM-3100', vin: 'MA1TL2WB4F2K11048', godown: 'g12', bay: 'Bay 02 (Dismantling)', cutType: 'chassis', inward: '2024-10-20T17:30', status: { label: 'Dismantling', tone: 'slate' } },
  { jobId: 'SCR-88473', name: '2011 Volkswagen Polo 1.2 MPI', plate: 'DL-08-AS-1192', vin: 'WVWZZZ6RZBY049812', godown: 'g01', bay: 'Bay 05 (Bale Stack)', cutType: 'full', inward: '2024-10-19T12:10', status: done },
  { jobId: 'SCR-88469', name: '2018 Ford EcoSport 1.5 TDCi', plate: 'MH-02-CP-8819', vin: 'MAJAXXMRHAJC20194', godown: 'g07', bay: 'Bay 01 (De-fluid Station)', cutType: 'full', inward: '2024-10-18T15:45', status: { label: 'Depollution', tone: 'amber' } },
  { jobId: 'SCR-88461', name: '2013 Maruti WagonR VXi', plate: 'DL-04-CA-7641', vin: 'MA3EWBE1S00294109', godown: 'g04', bay: 'Bay 03 (Engine Harvest)', cutType: 'chassis', inward: '2024-10-17T11:00', status: done },
  { jobId: 'SCR-88455', name: '2015 Hyundai i20 Elite Asta', plate: 'MH-04-ET-9104', vin: 'MALB451CLFM771290', godown: 'g12', bay: 'Bay 04 (Baling Floor)', cutType: 'full', inward: '2024-10-16T16:20', status: done },
]

export const VEHICLES: Vehicle[] = SEED.map((s) => ({
  ...s,
  media: [],
  notes: [],
  owner: { rcNumber: '', idType: 'aadhaar', idNumber: '' },
}))
