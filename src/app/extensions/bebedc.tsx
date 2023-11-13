import React, { useCallback, useEffect, useState } from "react"
import {
  Flex,
  hubspot,
  Select,
  Alert,
  ProgressBar,
  TextArea,
  Heading,
} from "@hubspot/ui-extensions"

hubspot.extend<'crm.record.tab'>(({ context, runServerlessFunction, actions }) => (
  <BEBEDC
    context={context}
    runServerless={runServerlessFunction}
    addAlert={actions.addAlert}
    fetchCrmObjectProperties={actions.fetchCrmObjectProperties}
  />
))

const BEBEDC = ({ context, runServerless, addAlert, fetchCrmObjectProperties }: {context : any, runServerless: any, addAlert: any, fetchCrmObjectProperties: any}) => {

  const [dealId, setDealId] = useState()
  const [score, setScore] = useState(0)

  const [need, setNeed] = useState('')
  const [issue, setIssue] = useState('')
  const [budget, setBudget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [decisionMakers, setDecisionMakers] = useState('')
  const [competitors, setCompetitors] = useState('')

  const [needComment, setNeedComment] = useState('')
  const [issueComment, setIssueComment] = useState('')
  const [budgetComment, setBudgetComment] = useState('')
  const [deadlineComment, setDeadlineComment] = useState('')
  const [decisionMakersComment, setDecisionMakersComment] = useState('')
  const [competitorsComment, setCompetitorsComment] = useState('')

  const [error, setError] = useState('')

  const objectId = {
    need: 'besoin',
    issue: 'enjeu',
    budget: 'budget',
    deadline: 'echeance',
    decisonMakers: 'decideurs',
    competitors: 'competiteurs',
    needComment: 'commentaire___besoin',
    issueComment: 'commentaire___enjeu',
    budgetComment: 'commentaire___budget',
    deadlineComment: 'commentaire___echeance',
    decisionMakersComment: 'commentaire___decideurs',
    competitorsComment: 'commentaire___competiteurs',
  }

  const options = [
    { label: '🔴 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0', value: 'Faible' },
    { label: '🟠 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0', value: 'Moyen' },
    { label: '🟢 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0', value: 'Fort' },
  ]

  useEffect(() => {
    fetchCrmObjectProperties([
      'hs_object_id',
      'besoin',
      'enjeu',
      'budget',
      'echeance',
      'decideurs',
      'competiteurs',
      'commentaire___besoin',
      'commentaire___enjeu',
      'commentaire___budget',
      'commentaire___echeance',
      'commentaire___decideurs',
      'commentaire___competiteurs'
    ]).then(
      (properties: { [propertyName: string]: any }) => {
        setDealId(properties.hs_object_id)

        setNeed(properties.besoin)
        setIssue(properties.enjeu)
        setBudget(properties.budget)
        setDeadline(properties.echeance)
        setDecisionMakers(properties.decideurs)
        setCompetitors(properties.competiteurs)

        setNeedComment(properties.commentaire___besoin)
        setIssueComment(properties.commentaire___enjeu)
        setBudgetComment(properties.commentaire___budget)
        setDeadlineComment(properties.commentaire___echeance)
        setDecisionMakersComment(properties.commentaire___decideurs)
        setCompetitorsComment(properties.commentaire___competiteurs)
      }
    )
  }, [fetchCrmObjectProperties])

  useEffect(() => {
    const calculateScores = () => {
      const newNeedScore = need === "Fort" ? 5 : need === "Moyen" ? 2 : 0
      const newIssueScore = issue === "Fort" ? 20 : issue === "Moyen" ? 10 : 0
      const newBudgetScore = budget === "Fort" ? 25 : budget === "Moyen" ? 12 : 0
      const newDeadlineScore = deadline === "Fort" ? 25 : deadline === "Moyen" ? 12 : 0
      const newDecisionMakersScore = decisionMakers === "Fort" ? 15 : decisionMakers === "Moyen" ? 7 : 0
      const newCompetitorsScore = competitors === "Fort" ? 10 : competitors === "Moyen" ? 5 : 0

      setScore(newNeedScore + newIssueScore + newBudgetScore + newDeadlineScore + newDecisionMakersScore + newCompetitorsScore)

      runServerless({
        name: 'updateScore',
        parameters: {
          score: score,
          dealId: dealId,
        },
      })
    }

    calculateScores()
  }, [need, issue, budget, deadline, decisionMakers, competitors])

  const handlePropsChange = useCallback(
    (newValue: any, objectId: string) => {
      runServerless({
        name: 'updateProps',
        parameters: {
          value: newValue,
          objectId: objectId,
          dealId: dealId,
        },
      }).then((resp: { status: string; message: string }) => {
        if (resp.status === 'SUCCESS') {
          addAlert({
            type: 'success',
            message: 'Mise à jour effectué !',
          })

          objectId === "besoin" ? setNeed(newValue) : null
          objectId === "enjeu" ? setIssue(newValue) : null
          objectId === "budget" ? setBudget(newValue) : null
          objectId === "echeance" ? setDeadline(newValue) : null
          objectId === "decideurs" ? setDecisionMakers(newValue) : null
          objectId === "competiteurs" ? setCompetitors(newValue) : null

          objectId === "commentaire___besoin" ? setNeedComment(newValue) : null
          objectId === "commentaire___enjeu" ? setIssueComment(newValue) : null
          objectId === "commentaire___budget" ? setBudgetComment(newValue) : null
          objectId === "commentaire___echeance" ? setDeadlineComment(newValue) : null
          objectId === "commentaire___decideurs" ? setDecisionMakersComment(newValue) : null
          objectId === "commentaire___competiteurs" ? setCompetitorsComment(newValue) : null
        } else {
          setError(resp.message || 'An error occurred')
        }
      })
    },
    [dealId, addAlert, runServerless]
  )

  if (error !== '') {
    return <Alert title="Error" variant="error">{error}</Alert>
  }

  return (
    <>
      <Flex direction="column" gap="lg">
        <Flex direction="column" gap="sm">
          <Heading>Score BEBEDC :</Heading>
          <ProgressBar variant={score >= 82 ? "success" : "warning"} value={score} showPercentage={true} />
        </Flex>

        <Flex direction="column" gap="md">
          <Flex gap="xl">
            <Select
              name="need"
              label="Besoin"
              options={options}
              readOnly={needComment?.length > 10 ? false : true}
              value={need}
              onChange={(newValue) => handlePropsChange(newValue, objectId.need)}
            />

            <Flex direction="column">
              <TextArea
                name="need"
                label="Commentaire"
                value={needComment}
                onChange={(newValue) => handlePropsChange(newValue, objectId.needComment)}
              />
            </Flex>
          </Flex>

          <Flex gap="xl">
            <Select
              name="issue"
              label="Enjeu"
              options={options}
              readOnly={issueComment?.length > 10 ? false : true}
              value={issue}
              onChange={(newValue) => handlePropsChange(newValue, objectId.issue)}
            />

            <Flex direction="column">
              <TextArea
                name="issue_comment"
                label="Commentaire"
                value={issueComment}
                onChange={(newValue) => handlePropsChange(newValue, objectId.issueComment)}
              />
            </Flex>
          </Flex>

          <Flex gap="xl">
            <Select
              name="budget"
              label="Budget"
              options={options}
              readOnly={budgetComment?.length > 10 ? false : true}
              value={budget}
              onChange={(newValue) => handlePropsChange(newValue, objectId.budget)}
            />

            <Flex direction="column">
              <TextArea
                name="budget_comment"
                label="Commentaire"
                value={budgetComment}
                onChange={(newValue) => handlePropsChange(newValue, objectId.budgetComment)}
              />
            </Flex>
          </Flex>

          <Flex gap="xl">
            <Select
              name="deadline"
              label="Échéance"
              options={options}
              readOnly={deadlineComment?.length > 10 ? false : true}
              value={deadline}
              onChange={(newValue) => handlePropsChange(newValue, objectId.deadline)}
            />

            <Flex direction="column">
              <TextArea
                name="deadline_comment"
                label="Commentaire"
                value={deadlineComment}
                onChange={(newValue) => handlePropsChange(newValue, objectId.deadlineComment)}
              />
            </Flex>
          </Flex>

          <Flex gap="xl">
            <Select
              name="decision-makers"
              label="Décideurs"
              options={options}
              readOnly={decisionMakersComment?.length > 10 ? false : true}
              value={decisionMakers}
              onChange={(newValue) => handlePropsChange(newValue, objectId.decisonMakers)}
            />

            <Flex direction="column">
              <TextArea
                name="decisionMakers_comment"
                label="Commentaire"
                value={decisionMakersComment}
                onChange={(newValue) => handlePropsChange(newValue, objectId.decisionMakersComment)}
              />
            </Flex>
          </Flex>

          <Flex gap="xl">
            <Select
              name="competitors"
              label="Compétiteurs"
              options={options}
              readOnly={competitorsComment?.length > 10 ? false : true}
              value={competitors}
              onChange={(newValue) => handlePropsChange(newValue, objectId.competitors)}
            />

            <Flex direction="column">
              <TextArea
                name="competitors_comment"
                label="Commentaire"
                value={competitorsComment}
                onChange={(newValue) => handlePropsChange(newValue, objectId.competitorsComment)}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}