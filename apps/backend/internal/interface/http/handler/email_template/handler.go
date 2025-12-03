package emailtemplatehandler

import (
	"github.com/go-playground/validator/v10"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
	emailtemplateusecase "github.com/smart-hmm/smart-hmm/internal/modules/email_template/usecase"
)

type EmailTemplateHandler struct {
	Template *TemplateHandler
	Version  *TemplateVersionHandler
	Variable *TemplateVariableHandler
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewEmailTemplateHandler(
	createTemplateUC *emailtemplateusecase.CreateTemplateUsecase,
	createVersionUC *emailtemplateusecase.CreateTemplateVersionUsecase,
	activateVersionUC *emailtemplateusecase.ActivateTemplateVersionUsecase,
	createVariableUC *emailtemplateusecase.CreateTemplateVariableUsecase,
	updateVariableUC *emailtemplateusecase.UpdateTemplateVariableUsecase,
	deleteVariableUC *emailtemplateusecase.DeleteTemplateVariableUsecase,
	listTemplateVarsUC *emailtemplateusecase.ListTemplateVariablesUsecase,
	previewTemplateUC *emailtemplateusecase.PreviewTemplateUsecase,
	repo emailtemplaterepository.EmailTemplateRepository,
) *EmailTemplateHandler {
	templateHandler := &TemplateHandler{
		CreateTemplateUC:  createTemplateUC,
		PreviewTemplateUC: previewTemplateUC,
		Repo:              repo,
	}

	versionHandler := &TemplateVersionHandler{
		CreateVersionUC:   createVersionUC,
		ActivateVersionUC: activateVersionUC,
		Repo:              repo,
	}

	variableHandler := &TemplateVariableHandler{
		CreateVariableUC:   createVariableUC,
		UpdateVariableUC:   updateVariableUC,
		DeleteVariableUC:   deleteVariableUC,
		ListTemplateVarsUC: listTemplateVarsUC,
		Repo:               repo,
	}

	return &EmailTemplateHandler{
		Template: templateHandler,
		Version:  versionHandler,
		Variable: variableHandler,
	}
}
