package metadatausecase

import (
	metadatadto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/metadata/dto"
	metadatadata "github.com/smart-hmm/smart-hmm/internal/modules/metadata/data"
)

type GetTenantMetadataUseCase struct{}

func NewGetTenantMetadataUseCase() *GetTenantMetadataUseCase {
	return &GetTenantMetadataUseCase{}
}

func (uc *GetTenantMetadataUseCase) Execute() metadatadto.TenantMetadataPayload {
	return metadatadto.TenantMetadataPayload{
		Industries: metadatadata.Industries,
		CompanySizes: []metadatadto.CompanySize{
			metadatadto.CompanySizeSmall,
			metadatadto.CompanySizeMedium,
			metadatadto.CompanySizeLarge,
		},
		Countries: metadatadata.Countries,
	}
}
