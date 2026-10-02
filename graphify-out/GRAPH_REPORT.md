# Graph Report - Cartefidelité  (2026-10-03)

## Corpus Check
- 709 files · ~4,802,651 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 3947 nodes · 12287 edges · 192 communities (161 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `318076bb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- @prisma/client
- rbac.ts
- merchant-card-template-service.ts
- env
- react
- loyalty-commit.ts
- firstActiveStaffMembership
- tarifs/page.tsx
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-properties.tsx
- jsonOk
- campaign-lifecycle.ts
- merchant-billing.ts
- session.ts
- cn
- requireMerchantAdmin
- clients/ui.tsx
- src/app/layout.tsx
- cards-index.tsx
- google-wallet.ts
- google-auth.ts
- middleware.ts
- demo-routing.test.ts
- prisma.ts
- fiche.tsx
- SettingsPanel
- customer-reward-progress.ts
- create-super-admin.ts
- programme/ui.tsx
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- wallet-home.tsx
- cashier-checkout.tsx
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- loyalty-program.ts
- merchant-card-finish.test.ts
- qa-login.ts
- ref_node_path
- dependencies
- loyaltyBalanceForMode
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- resolveMediaFilePath
- card-enlarged-view.tsx
- employee-session.ts
- scripts
- facturation/ui.tsx
- platform-stats.ts
- employee-demo-server.ts
- qr-cache.ts
- vitest
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- google-wallet/route.ts
- demo-visual.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- caisse-client-number.test.ts
- rejoindre/[slug]/page.tsx
- lib/campaign-worker.ts
- marketing-topup-route.test.ts
- campaigns/[id]/confirm/route.ts
- stripe.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- EmployeeDetailPanel
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- jsonError
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- customer-loyalty-overview.ts
- MerchantCampaignFiche
- profile-page.tsx
- loyalty-labels.ts
- types.ts
- graphify reference: query, path, explain
- campaign-worker.test.ts
- google-wallet-doctor.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- env.ts
- ad-confirm-route.test.ts
- loyalty-card-view-model.ts
- campaign-confirm-route.test.ts
- sponsored-placements.test.ts
- app/app/connexion/page.tsx
- customer-layout-guard.ts
- sponsored-hours-pricing.ts
- webhook/route.ts
- merchants-list.tsx
- outils/ui.tsx
- app/ui.tsx
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- merchant-ad-edit.test.ts
- landing-page.test.ts
- ref_crypto
- buildGoogleWalletMerchantView
- push-client.ts
- campaign-moderation-home.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- global-card.tsx
- google-wallet-media-route.test.ts
- use-wallet-unlock-animation.ts
- campaign-test-mode-isolation.test.ts
- loyalty-service.test.ts
- landing-hero-visual.tsx
- caisse-scan.test.ts
- employee-invitation-service.ts
- customer/history/route.ts
- customer-preferences-route.test.ts
- super-admin-ad-moderation.test.ts
- sponsored-slot.tsx
- finalisation/page.tsx
- ads/[id]/confirm/route.ts
- employee-access.test.ts
- push.ts
- customer-push-route.test.ts
- ad-detail.tsx
- FakeIntersectionObserver
- staff-permissions.ts
- CreateMerchantWizard
- exchange/route.ts
- card-deck.tsx
- sponsored-selection.ts
- SettingsPage
- scripts/campaign-worker.ts
- loyalty-reward-removal.ts
- EmployeeLoginScreen
- app/statistiques/page.tsx
- next
- card-template-schema.ts
- campaign-quota.test.ts
- landing-faq.tsx
- theme-toggle.tsx
- campaign-audience.test.ts
- avatar-storage.ts
- use-media-query.ts
- CardTemplateConfig
- ref_fs_promises
- ref_motion_react
- ref_next_font_google
- ref_next_headers
- ref_next_link
- ref_next_navigation
- ref_next_server
- ref_node_fs_promises
- ref_react_dom_client
- ref_react_dom_server
- ref_vitest_config

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 257 edges
2. `jsonOk()` - 223 edges
3. `next` - 161 edges
4. `requireMutatingRequest()` - 160 edges
5. `prisma` - 147 edges
6. `vitest` - 120 edges
7. `clientIp()` - 119 edges
8. `readJson()` - 114 edges
9. `react` - 111 edges
10. `userAgent()` - 108 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `getActiveStripeMode()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `isPaymentAllowedForMerchant()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `approvedAd()` --calls--> `PATCH()`  [EXTRACTED]
  tests/campaign-fixes.test.ts → src/app/api/merchant/ads/[id]/route.ts
- `submit()` --indirect_call--> `schedule()`  [INFERRED]
  src/app/app/campagnes/ui.tsx → tests/ad-visual-journeys.test.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (192 total, 31 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.14
Nodes (21): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+13 more)

### Community 1 - "@prisma/client"
Cohesion: 0.10
Nodes (36): @prisma/client, dynamic, MerchantProfilePage(), formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl() (+28 more)

### Community 2 - "rbac.ts"
Cohesion: 0.10
Nodes (26): CaissePage(), DashboardLayout(), LandingAuthTargets, hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, MerchantAppAccess, resolveMerchantAppAccess() (+18 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (54): LegacyCardEditorRedirect(), CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), cardSlotForLoyaltyMode(), isLoyaltyProgramSlot() (+46 more)

### Community 4 - "env"
Cohesion: 0.13
Nodes (12): GET(), dynamic, robots(), dynamic, sitemap(), isSafeAdUrl(), env, isWithinUtcIntervals() (+4 more)

### Community 5 - "react"
Cohesion: 0.09
Nodes (32): react, DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), Merchant (+24 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.11
Nodes (37): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+29 more)

### Community 7 - "firstActiveStaffMembership"
Cohesion: 0.23
Nodes (19): CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), FacturationPage(), OutilsPage() (+11 more)

### Community 8 - "tarifs/page.tsx"
Cohesion: 0.18
Nodes (9): HomePage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, resolveLandingAuthTargets() (+1 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.10
Nodes (21): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct(), ProgressCircle() (+13 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (48): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), publishValidationResult() (+40 more)

### Community 11 - "validation.ts"
Cohesion: 0.05
Nodes (53): POST(), schema, DELETE(), POST(), DELETE(), deleteSchema, POST(), GET() (+45 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (64): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+56 more)

### Community 14 - "jsonOk"
Cohesion: 0.10
Nodes (74): POST(), POST(), POST(), POST(), POST(), POST(), POST(), GET() (+66 more)

### Community 15 - "campaign-lifecycle.ts"
Cohesion: 0.42
Nodes (7): CAMPAIGN_STATUS_LABELS, isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 16 - "merchant-billing.ts"
Cohesion: 0.10
Nodes (29): GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices() (+21 more)

### Community 17 - "session.ts"
Cohesion: 0.12
Nodes (27): POST(), GET(), POST(), POST(), GET(), POST(), DELETE(), GET() (+19 more)

### Community 18 - "cn"
Cohesion: 0.09
Nodes (25): DashboardLayout(), AppNav(), icons, isActive(), TOOLS_PREFIXES, ExpandableQrCode(), handleActivate(), openQr() (+17 more)

### Community 19 - "requireMerchantAdmin"
Cohesion: 0.06
Nodes (57): EDITABLE_STATUSES, GET(), PATCH(), GET(), GET(), POST(), POST(), GET() (+49 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.12
Nodes (18): CustomerDetailPage(), ClientsPage(), Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats (+10 more)

### Community 21 - "src/app/layout.tsx"
Cohesion: 0.14
Nodes (9): next-themes, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 22 - "cards-index.tsx"
Cohesion: 0.07
Nodes (28): recharts, Check, Item, ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow (+20 more)

### Community 23 - "google-wallet.ts"
Cohesion: 0.15
Nodes (33): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+25 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.08
Nodes (42): POST(), schema, GET(), GET(), POST(), POST(), authenticateCustomerWithPassword(), createCustomerSession() (+34 more)

### Community 25 - "middleware.ts"
Cohesion: 0.14
Nodes (25): isProduction(), hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost() (+17 more)

### Community 26 - "demo-routing.test.ts"
Cohesion: 0.16
Nodes (11): CLIENT_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE, demoEnterTarget(), DemoRole, isMerchantDemoCookieValue() (+3 more)

### Community 27 - "prisma.ts"
Cohesion: 0.07
Nodes (39): zod, schema, POST(), POST(), POST(), dynamic, dynamic, logCustomerQr() (+31 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.12
Nodes (19): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block (+11 more)

### Community 30 - "customer-reward-progress.ts"
Cohesion: 0.21
Nodes (16): buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, progressLineForTarget(), evaluateCustomerRewards() (+8 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "programme/ui.tsx"
Cohesion: 0.08
Nodes (32): DEMO_CONFIG, HistoricalEntitlement, DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep() (+24 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.12
Nodes (31): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+23 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.11
Nodes (24): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+16 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.10
Nodes (34): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+26 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.18
Nodes (18): beginCustomerOnboarding(), CustomerAccessLevel, CustomerOnboardingUser, customerWalletGuardRedirect(), FINALIZATION_PATH_PREFIXES, FINALIZATION_REMINDER_MS, isCustomerProfileComplete(), isCustomerProfileFinalized() (+10 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (32): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+24 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.12
Nodes (28): GET(), notFound(), appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind (+20 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "wallet-home.tsx"
Cohesion: 0.17
Nodes (11): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), WalletEventPayload, WalletHome(), WalletQrAction(), buildFifeLifeNextReward(), CardNextRewardEntry (+3 more)

### Community 44 - "cashier-checkout.tsx"
Cohesion: 0.09
Nodes (36): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+28 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.20
Nodes (15): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), applyDemoRoleCookies(), clearCookieOnResponse() (+7 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.11
Nodes (23): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+15 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (19): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+11 more)

### Community 49 - "loyalty-program.ts"
Cohesion: 0.09
Nodes (33): AmountTier, AppliedTier, computeEarn(), normalizeThresholdUnit(), parseRewardConditionsField(), ProgramConfig, activeEligibleRewards(), assertRewardLimit() (+25 more)

### Community 50 - "merchant-card-finish.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.12
Nodes (29): assertNoUnknownArgs(), main(), parseTtlMinutes(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), assertQaLoginTtlMinutes(), auditQaLogin() (+21 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (39): ref_node_buffer, ref_node_fs, ref_node_path, ref_node_url, ref_node_zlib, playwright, outDir, pages (+31 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "loyaltyBalanceForMode"
Cohesion: 0.13
Nodes (29): main(), dynamic, GET(), GET(), LOYALTY_MODES, GET(), CarteIndexPage(), dynamic (+21 more)

### Community 55 - "email.ts"
Cohesion: 0.19
Nodes (25): nodemailer, ContactPage(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint() (+17 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.06
Nodes (69): GET(), GET(), PERIOD_KEYS, requireMerchantStatsAccess(), addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys() (+61 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.17
Nodes (9): MobilePlacementPreview(), resetSponsoredSessionState(), AD, calls, flush(), mount(), Observer, observers (+1 more)

### Community 59 - "resolveMediaFilePath"
Cohesion: 0.38
Nodes (5): GET(), MIME, GET(), MIME, resolveMediaFilePath()

### Community 60 - "card-enlarged-view.tsx"
Cohesion: 0.15
Nodes (15): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), DiscoverPage(), Merchant (+7 more)

### Community 61 - "employee-session.ts"
Cohesion: 0.20
Nodes (13): EmployeeLoginPage(), ProEntryPage(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, employeeTokenFromRequest(), getEmployeeSession() (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "employee-demo-server.ts"
Cohesion: 0.28
Nodes (8): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, src_lib_employee_demo_employee_demo_cookie, isEmployeeDemoCookie(), isEmployeeDevDemo(), resolveEmployeeDemo()

### Community 66 - "qr-cache.ts"
Cohesion: 0.20
Nodes (15): QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr(), getCachedQr(), getPersonalizedQr(), inflight (+7 more)

### Community 67 - "vitest"
Cohesion: 0.08
Nodes (19): ref_fs, ref_path, vitest, main(), outDir, shot(), outDir, main() (+11 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "google-wallet/route.ts"
Cohesion: 0.14
Nodes (24): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+16 more)

### Community 71 - "demo-visual.ts"
Cohesion: 0.10
Nodes (28): CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_CARDS, PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE (+20 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.13
Nodes (31): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+23 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "caisse-client-number.test.ts"
Cohesion: 0.21
Nodes (10): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 75 - "rejoindre/[slug]/page.tsx"
Cohesion: 0.16
Nodes (9): CustomerLoginPage(), CustomerLoginForm(), googleMessage(), recoverMessage(), CustomerSignupPage(), CustomerSignupForm(), JoinMerchantPage(), isGoogleAuthConfigured() (+1 more)

### Community 76 - "lib/campaign-worker.ts"
Cohesion: 0.15
Nodes (18): jose, backoffMinutesForAttempt(), deliveryChannelsFor(), materializeDeliveries(), processPendingDeliveries(), sendOneDelivery(), sendOneDeliveryUnsafe(), unsubscribeScopeFor() (+10 more)

### Community 77 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 78 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.16
Nodes (26): POST(), GET(), GET(), serializeCampaign(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience() (+18 more)

### Community 79 - "stripe.ts"
Cohesion: 0.10
Nodes (27): stripe, BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, createBillingPortalSession() (+19 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.09
Nodes (26): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), DiagnosticPage(), SuperAdminDiagnosticPage() (+18 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "qr.ts"
Cohesion: 0.17
Nodes (17): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 85 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.14
Nodes (15): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, h, jsonRequest() (+7 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "jsonError"
Cohesion: 0.08
Nodes (46): GET(), PATCH(), GET(), POST(), GET(), DELETE(), GET(), dynamic (+38 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.05
Nodes (40): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), AD_STATUS_LABELS, AdRequest, AdStatus (+32 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "customer-loyalty-overview.ts"
Cohesion: 0.09
Nodes (28): CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel() (+20 more)

### Community 102 - "MerchantCampaignFiche"
Cohesion: 0.35
Nodes (10): api(), MerchantCampaignFiche(), addSources(), onFile(), onFramed(), post(), onFileChosen(), isExactBanner() (+2 more)

### Community 103 - "profile-page.tsx"
Cohesion: 0.13
Nodes (26): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+18 more)

### Community 104 - "loyalty-labels.ts"
Cohesion: 0.15
Nodes (22): GET(), sortOrder(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), balanceFieldForUnit(), incrementBalanceData(), legacyPointsForUnitBalance() (+14 more)

### Community 105 - "types.ts"
Cohesion: 0.14
Nodes (9): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList(), ProgramPreviewCard() (+1 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "google-wallet-doctor.ts"
Cohesion: 0.39
Nodes (8): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl()

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "notifications-center.tsx"
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "env.ts"
Cohesion: 0.24
Nodes (3): assertSameOrigin(), CsrfError, getAllowedOrigins()

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "loyalty-card-view-model.ts"
Cohesion: 0.18
Nodes (13): DEMO_TIER_DECK_ORDER, getLoyaltyCardTierLabel(), LOYALTY_CARD_BACKGROUNDS, LOYALTY_CARD_TIER_LABELS, LoyaltyCardTierKey, WALLET_TIER_TO_CARD_KEY, walletTierToCardKey(), buildLoyaltyCardViewModel() (+5 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-placements.test.ts"
Cohesion: 0.09
Nodes (31): GET(), GET(), previewResponse(), staffContext(), loadAdPreviewCard(), parsePlacement(), selectSponsoredForCustomer(), END (+23 more)

### Community 125 - "app/app/connexion/page.tsx"
Cohesion: 0.39
Nodes (6): AppLoginPage(), formatEurosFromCents(), isMerchantPlanId(), MERCHANT_PLANS, MerchantPlan, MerchantPlanId

### Community 126 - "customer-layout-guard.ts"
Cohesion: 0.46
Nodes (4): CarteLayout(), CompteLayout(), NotificationsLayout(), enforceCustomerWalletAccess()

### Community 127 - "sponsored-hours-pricing.ts"
Cohesion: 0.12
Nodes (25): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotAmountCents() (+17 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.11
Nodes (25): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), refundIncludedQuota() (+17 more)

### Community 129 - "merchants-list.tsx"
Cohesion: 0.36
Nodes (6): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel()

### Community 130 - "outils/ui.tsx"
Cohesion: 0.29
Nodes (5): FidelisationPanel(), icons, OutilsPanel(), TOOLS, ToolCard()

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.25
Nodes (14): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+6 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 135 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 136 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 137 - "ref_crypto"
Cohesion: 0.47
Nodes (5): ref_crypto, installQaMocks(), loadQaLogin(), sha256(), state

### Community 138 - "buildGoogleWalletMerchantView"
Cohesion: 0.25
Nodes (17): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData() (+9 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.25
Nodes (13): approvedAd(), asAdmin(), asMerchant(), ctx(), dataUrl(), fake, futureSchedule(), h (+5 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.14
Nodes (12): ref_sharp, files, INPUT_DIR, adminStage(), createAd(), ctx(), fake, h (+4 more)

### Community 143 - "global-card.tsx"
Cohesion: 0.20
Nodes (13): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), PREVIEW_QR, LADDER, resolveTier(), TIER_STYLE (+5 more)

### Community 145 - "use-wallet-unlock-animation.ts"
Cohesion: 0.14
Nodes (25): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), sseChunk(), isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation() (+17 more)

### Community 146 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "landing-hero-visual.tsx"
Cohesion: 0.33
Nodes (5): CoffeeIcon(), QrCodeIcon(), WalletCardsIcon(), WifiIcon(), LandingHeroVisual()

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.16
Nodes (20): GET(), POST(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate() (+12 more)

### Community 151 - "customer/history/route.ts"
Cohesion: 0.24
Nodes (10): FILTER_MAP, GET(), BenefitEntry, formatFifeLifeEntry(), formatLoyaltyEntry(), HistoryCategory, HistoryEntry, mapLoyaltyCategory() (+2 more)

### Community 152 - "customer-preferences-route.test.ts"
Cohesion: 0.07
Nodes (21): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser, basePrefs, consentEventCreateMany, customerPreferencesCreate (+13 more)

### Community 153 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.26
Nodes (10): IMAGE_CLASS, SponsoredAd, SponsoredBanner(), SponsoredVariant, getDismissedAds(), rememberDismissed(), reportedThisSession, SponsoredPlacement (+2 more)

### Community 155 - "finalisation/page.tsx"
Cohesion: 0.27
Nodes (6): FinalisationPage(), FinalisationForm(), isSmsConfigured(), sendSms(), smsConfigHint(), SmsSendResult

### Community 156 - "ads/[id]/confirm/route.ts"
Cohesion: 0.33
Nodes (15): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, GET() (+7 more)

### Community 157 - "employee-access.test.ts"
Cohesion: 0.53
Nodes (4): assertEarnProgramRules(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie()

### Community 158 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 159 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 160 - "ad-detail.tsx"
Cohesion: 0.09
Nodes (28): AdDetailPage(), confirmReason(), patch(), requestSend(), run(), sendProposal(), AdRequestDetail, AdStatus (+20 more)

### Community 162 - "staff-permissions.ts"
Cohesion: 0.13
Nodes (10): DEMO_EMPLOYEE, ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS, PERMISSION_LABELS (+2 more)

### Community 163 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 164 - "exchange/route.ts"
Cohesion: 0.22
Nodes (10): GET(), POST(), QaExchangeBody, qaJson(), qaNotFound(), dynamic, QaLoginPage(), QaLoginClient() (+2 more)

### Community 165 - "card-deck.tsx"
Cohesion: 0.18
Nodes (13): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+5 more)

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.12
Nodes (27): main(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS (+19 more)

### Community 167 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 168 - "scripts/campaign-worker.ts"
Cohesion: 0.36
Nodes (8): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick(), claimNextScheduledCampaign(), finalizeCampaignIfComplete(), runWorkerTick()

### Community 169 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 170 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 171 - "app/statistiques/page.tsx"
Cohesion: 0.40
Nodes (3): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage()

### Community 172 - "next"
Cohesion: 0.05
Nodes (21): nextConfig, next, metadata, ContactForm(), SPACES, metadata, viewport, SPACES (+13 more)

### Community 173 - "card-template-schema.ts"
Cohesion: 0.10
Nodes (27): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CARD_SCHEMA_VERSION, CardDecorativeStyle (+19 more)

### Community 174 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 175 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 176 - "theme-toggle.tsx"
Cohesion: 0.50
Nodes (3): MoonIcon(), SunIcon(), ThemeToggle()

### Community 178 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

### Community 181 - "CardTemplateConfig"
Cohesion: 0.24
Nodes (6): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardTemplateConfig

## Knowledge Gaps
- **995 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+990 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1345 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `caisse-scan.ts`, `@prisma/client`, `rbac.ts`, `app/ui.tsx`, `env`, `react`, `merchant-card-template-service.ts`, `firstActiveStaffMembership`, `merchants-list.tsx`, `tarifs/page.tsx`, `merchant-ad-edit.test.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-moderation-home.tsx`, `jsonOk`, `global-card.tsx`, `session.ts`, `cn`, `clients/ui.tsx`, `src/app/layout.tsx`, `cards-index.tsx`, `google-auth.ts`, `middleware.ts`, `demo-routing.test.ts`, `prisma.ts`, `finalisation/page.tsx`, `customer-preferences-route.test.ts`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`, `programme/ui.tsx`, `ad-detail.tsx`, `package.json`, `card-editor.tsx`, `exchange/route.ts`, `ad-visuals.ts`, `[id]/merchant-detail.tsx`, `scan/ui.tsx`, `app/statistiques/page.tsx`, `wallet-home.tsx`, `demo-session.ts`, `src/app/page.tsx`, `qa-login.ts`, `loyaltyBalanceForMode`, `insight-stats.ts`, `resolveMediaFilePath`, `card-enlarged-view.tsx`, `employee-session.ts`, `employee-demo-server.ts`, `vitest`, `demo-visual.ts`, `rejoindre/[slug]/page.tsx`, `lib/campaign-worker.ts`, `marketing-topup-route.test.ts`, `super-admin-session.ts`, `jsonError`, `campagnes/ui.tsx`, `customer-loyalty-overview.ts`, `profile-page.tsx`, `types.ts`, `notifications-center.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `customer-layout-guard.ts`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `@prisma/client`, `rbac.ts`, `merchant-card-template-service.ts`, `env`, `react`, `loyalty-commit.ts`, `tarifs/page.tsx`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `campaign-lifecycle.ts`, `merchant-billing.ts`, `cn`, `requireMerchantAdmin`, `src/app/layout.tsx`, `google-auth.ts`, `middleware.ts`, `demo-routing.test.ts`, `customer-reward-progress.ts`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `customer-onboarding.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `wallet-home.tsx`, `cashier-checkout.tsx`, `loyalty-program.ts`, `merchant-card-finish.test.ts`, `ref_node_path`, `loyaltyBalanceForMode`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `platform-stats.ts`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `google-wallet/route.ts`, `demo-visual.ts`, `merchant-card-renderer.tsx`, `caisse-client-number.test.ts`, `lib/campaign-worker.ts`, `marketing-topup-route.test.ts`, `campaigns/[id]/confirm/route.ts`, `stripe.ts`, `qr.ts`, `ad-visual-journeys.test.ts`, `loyalty-labels.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `app/app/connexion/page.tsx`, `webhook/route.ts`, `super-admin-campaign-moderation.test.ts`, `merchant-ad-edit.test.ts`, `landing-page.test.ts`, `ref_crypto`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `google-wallet-media-route.test.ts`, `use-wallet-unlock-animation.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-service.test.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `customer-preferences-route.test.ts`, `super-admin-ad-moderation.test.ts`, `employee-access.test.ts`, `customer-push-route.test.ts`, `card-deck.tsx`, `loyalty-reward-removal.ts`, `card-template-schema.ts`, `campaign-quota.test.ts`, `campaign-audience.test.ts`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `loyalty-commit.ts`, `loyalty-widget.ts`, `validation.ts`, `card-editor-properties.tsx`, `jsonOk`, `campaign-lifecycle.ts`, `merchant-billing.ts`, `session.ts`, `use-wallet-unlock-animation.ts`, `requireMerchantAdmin`, `loyalty-service.test.ts`, `cards-index.tsx`, `customer/history/route.ts`, `google-auth.ts`, `employee-invitation-service.ts`, `google-wallet.ts`, `prisma.ts`, `customer-reward-progress.ts`, `create-super-admin.ts`, `programme/ui.tsx`, `card-editor.tsx`, `package.json`, `staff-permissions.ts`, `customer-onboarding.ts`, `sponsored-selection.ts`, `loyalty-reward-removal.ts`, `wallet-home.tsx`, `cashier-checkout.tsx`, `next`, `loyalty-program.ts`, `merchant-card-finish.test.ts`, `qa-login.ts`, `loyaltyBalanceForMode`, `insight-stats.ts`, `employee-session.ts`, `platform-stats.ts`, `merchant-card-renderer.tsx`, `lib/campaign-worker.ts`, `campaigns/[id]/confirm/route.ts`, `super-admin-session.ts`, `qr.ts`, `jsonError`, `customer-loyalty-overview.ts`, `loyalty-labels.ts`, `types.ts`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _995 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caisse-scan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._
- **Should `@prisma/client` be split into smaller, more focused modules?**
  _Cohesion score 0.10289115646258504 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._