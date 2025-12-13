package tenantmemberrepository

import (
	"context"
	"errors"

	tenantDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
	tenantMemberDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/domain"
)

var (
	ErrTenantMemberNotFound = errors.New("tenant member not found")
)

type TenantMemberRepository interface {
	Save(ctx context.Context, member *tenantMemberDomain.TenantMember) error
	Delete(ctx context.Context, tenantId, userId string) error
	GetByTenantAndUser(ctx context.Context, tenantId string, userId string) (*tenantMemberDomain.TenantMember, error)
	GetTenantsByUserId(ctx context.Context, userId string) ([]*tenantDomain.Tenant, error)
	Exists(ctx context.Context, tenantId, userId string) (bool, error)
	CountByTenantAndRole(ctx context.Context, tenantId string, role tenantMemberDomain.TenantRole) (int, error)
	ListByTenantID(ctx context.Context, tenantId string) ([]*tenantMemberDomain.TenantMember, error)
}
