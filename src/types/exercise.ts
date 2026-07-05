export interface Exercise {
  id: number
  slug: string
  title: string
  description: string
  starterCode: string
  solutionCode: string
}

export interface ExerciseState {
  code: string
  completed: boolean
}
