# Graph Report - Cartefidelité  (2026-09-30)

## Corpus Check
- 627 files · ~4,755,114 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 6, .example 4, .css 3)

## Summary
- 3422 nodes · 10402 edges · 174 communities (148 shown, 26 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ce5a9e1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- next-reward-styles.ts
- rbac.ts
- merchant-card-template-service.ts
- next
- react
- loyalty-commit.ts
- ref_next_navigation
- employee-session.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-template-schema.ts
- jsonOk
- loyalty-labels.ts
- loyalty-context.ts
- prisma.ts
- merchant-ui.tsx
- use-wallet-unlock-animation.ts
- clients/ui.tsx
- profile-page.tsx
- insight-period.ts
- loyaltyBalanceForMode
- google-auth.ts
- env
- @prisma/client
- http.ts
- ad-detail.tsx
- advantages-ui.tsx
- insight-charts.tsx
- create-super-admin.ts
- requireMerchantAdmin
- CardEditorPage
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- card-editor-legacy-reset.test.ts
- demo-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- wallet-home.tsx
- ref_fs_promises
- demo-routing.test.ts
- src/app/page.tsx
- compilerOptions
- card-editor-polish.test.ts
- loyalty-program-publication.ts
- customer-loyalty-overview.ts
- qa-login.ts
- ref_node_fs_promises
- dependencies
- isGoogleWalletConfigured
- email.ts
- devDependencies
- insight-stats.ts
- HourlySchedulePicker
- demo-visual.ts
- merchant-roulette.tsx
- loyalty-service.test.ts
- scripts
- preview-data.ts
- super-admin.test.ts
- google-wallet/route.ts
- caisse-client-number.test.ts
- vitest
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- super-admin-session.ts
- staff-permissions.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- verify-viewports.mjs
- ref_next_server
- unsubscribe-token.ts
- playwright
- MerchantDetailPage
- stripe.ts
- getSuperAdminSessionUser
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- EmployeeDetailPanel
- super-admin/campagnes/page.tsx
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- marketing-balance.test.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- capture-employe-screenshots.mjs
- api-merchant-statistics-route.test.ts
- generate-pwa-icons.mjs
- src/app/layout.tsx
- ProgramConfigurator
- graphify reference: query, path, explain
- campaign-worker.test.ts
- api-guard.ts
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
- cards-index.tsx
- ad-confirm-route.test.ts
- qa-login/page.tsx
- campaign-confirm-route.test.ts
- merchant/ads/[id]/route.ts
- GET
- stripe-mode.test.ts
- merchant-create-service.ts
- webhook/route.ts
- lib/campaign-worker.ts
- discover-page.tsx
- env.ts
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- program/route.ts
- merchant-ad-edit.test.ts
- theme-provider.tsx
- campaign-test-mode-isolation.test.ts
- google-wallet-doctor.ts
- push-client.ts
- getEmployeeSession
- CreateMerchantWizard
- campaign-lifecycle.ts
- loyalty-cards-capture.mjs
- jsonError
- EmployeeLoginScreen
- CampagnesPanel
- cashier-checkout.tsx
- use-media-query.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- parametres/ui.tsx
- marketing-topup-route.test.ts
- SettingsPage
- google-wallet.ts
- app/ui.tsx
- solde/ui.tsx
- capture-employe-app-screenshots.mjs
- capture-super-admin.mjs
- app/statistiques/page.tsx
- scripts/campaign-worker.ts
- merchant-search-v1.mjs
- wallet-desktop-capture.mjs
- avatar-editor.tsx
- generate-google-wallet-logo.mjs
- SelfVisualCropper
- SponsorWizard
- abonnements/page.tsx
- super-admin/page.tsx
- use-editor-history.ts
- employee-app-capture.mjs
- series/route.ts
- demo/scan/page.tsx
- prisma

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 202 edges
2. `jsonOk()` - 184 edges
3. `requireMutatingRequest()` - 123 edges
4. `prisma` - 115 edges
5. `vitest` - 104 edges
6. `react` - 98 edges
7. `clientIp()` - 94 edges
8. `@prisma/client` - 93 edges
9. `userAgent()` - 90 edges
10. `readJson()` - 88 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `mockLoyaltyContext()` --calls--> `loyaltyUnitForMode()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-labels.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (174 total, 26 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.15
Nodes (20): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+12 more)

### Community 1 - "next-reward-styles.ts"
Cohesion: 0.22
Nodes (14): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CardNextRewardStyle, cardTemplateConfigSchema (+6 more)

### Community 2 - "rbac.ts"
Cohesion: 0.11
Nodes (25): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, MerchantAppAccess, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+17 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.08
Nodes (46): LegacyCardEditorRedirect(), CardEditorVariantRoute(), convertConfigForTargetSlot(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), cardSlotForLoyaltyMode() (+38 more)

### Community 4 - "next"
Cohesion: 0.11
Nodes (7): nextConfig, next, metadata, viewport, dynamic, dynamic, metadata

### Community 5 - "react"
Cohesion: 0.03
Nodes (80): ref_next_link, react, DashboardLayout(), DEMO_CONFIG, MODES, PROGRAM_STEPS, Merchant, MerchantPublic() (+72 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.07
Nodes (59): appliedTierLabel(), assembleView(), buildView(), CAISSE_GRANT_TTL_MS, commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive() (+51 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.28
Nodes (18): ref_next_navigation, CampagnesPage(), SoldeMarketingPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), OutilsPage(), MerchantHomePage() (+10 more)

### Community 8 - "employee-session.ts"
Cohesion: 0.27
Nodes (12): cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, employeeTokenFromRequest() (+4 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.13
Nodes (12): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetView(), pct(), ProgressCircle(), Props (+4 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (42): buildElementCatalog(), LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+34 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (45): zod, POST(), schema, AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar() (+37 more)

### Community 12 - "VisualPicker"
Cohesion: 0.29
Nodes (10): deleteCampaignMediaUrl(), readFileAsDataUrl(), uploadCampaignMedia(), VisualPicker(), onCropConfirm(), onFidetoFilesSelected(), onSelfFileSelected(), removeFidetoImage() (+2 more)

### Community 13 - "card-template-schema.ts"
Cohesion: 0.05
Nodes (83): PreviewScenario, PROGRESS_STEPS, SCENARIO_LABELS, ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES (+75 more)

### Community 14 - "jsonOk"
Cohesion: 0.13
Nodes (51): POST(), POST(), POST(), POST(), POST(), schema, DELETE(), POST() (+43 more)

### Community 15 - "loyalty-labels.ts"
Cohesion: 0.15
Nodes (24): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), incrementBalanceData(), computeLoyalty(), earnGainLabel(), formatSignedUnitDelta(), historyEntryLabel() (+16 more)

### Community 16 - "loyalty-context.ts"
Cohesion: 0.10
Nodes (37): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), assertEarnProgramRules(), buildProgramSnapshot(), buildProgramSnapshotFromContext() (+29 more)

### Community 17 - "prisma.ts"
Cohesion: 0.10
Nodes (21): GET(), POST(), GET(), GET(), GET(), GET(), GET(), GET() (+13 more)

### Community 18 - "merchant-ui.tsx"
Cohesion: 0.12
Nodes (18): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), FidelisationPanel(), icons (+10 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.16
Nodes (22): isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), mergeMerchantCardUpdate(), parseCardTemplateFromPayload(), hasRenderReadyTemplate(), normalizePublishedWalletTemplate() (+14 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.13
Nodes (17): CustomerDetailPage(), ClientsPage(), Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats (+9 more)

### Community 21 - "profile-page.tsx"
Cohesion: 0.16
Nodes (21): GlassBottomSheet(), SheetAction(), HistoryFilter, ProfilePage(), patchProfile(), saveNameEdit(), APP_VERSION, APPEARANCE_OPTIONS (+13 more)

### Community 22 - "insight-period.ts"
Cohesion: 0.20
Nodes (21): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, InsightRange (+13 more)

### Community 23 - "loyaltyBalanceForMode"
Cohesion: 0.14
Nodes (19): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, deriveClientNumber() (+11 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.07
Nodes (42): GET(), GET(), AppLoginPage(), CustomerLoginPage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage() (+34 more)

### Community 25 - "env"
Cohesion: 0.17
Nodes (21): env, hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost() (+13 more)

### Community 26 - "@prisma/client"
Cohesion: 0.13
Nodes (20): @prisma/client, GET(), LOYALTY_MODES, dynamic, MerchantProfilePage(), JoinMerchantPage(), getPublishedCardTemplate(), decideRewardRemoval() (+12 more)

### Community 27 - "http.ts"
Cohesion: 0.12
Nodes (24): schema, dynamic, logCustomerQr(), POST(), runtime, schema, POST(), GET() (+16 more)

### Community 28 - "ad-detail.tsx"
Cohesion: 0.13
Nodes (13): AdDetailPage(), AdImage, AdRequestDetail, AdStatsPayload, AdStatus, AdVisualEditor(), onFileChange(), AuditRow (+5 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.15
Nodes (16): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+8 more)

### Community 30 - "insight-charts.tsx"
Cohesion: 0.17
Nodes (14): recharts, InsightBarChart(), InsightCard(), InsightDonutChart(), InsightHeatmap(), InsightLineChart(), InsightMultiLineChart(), KpiCard() (+6 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "requireMerchantAdmin"
Cohesion: 0.13
Nodes (41): computeAdPricing(), GET(), POST(), POST(), GET(), GET(), POST(), serializeCampaign() (+33 more)

### Community 33 - "CardEditorPage"
Cohesion: 0.17
Nodes (21): CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction(), saveDraft() (+13 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (25): description, engines, node, name, private, version, eslint, eslint-config-next (+17 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.13
Nodes (19): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+11 more)

### Community 37 - "card-editor-legacy-reset.test.ts"
Cohesion: 0.20
Nodes (11): defaultCardTemplateConfig(), freshDraftConfigForSlot(), resetDraftForSlot(), legacyHeavyConfig(), merchantFindFirst, templateCreate, templateFindFirst, templateUpdate (+3 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.15
Nodes (19): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+11 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (32): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+24 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.12
Nodes (28): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig (+20 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "wallet-home.tsx"
Cohesion: 0.04
Nodes (92): ref_motion_react, react-dom, ref_react_dom_client, ref_react_dom_server, AddToGoogleWalletButton(), activeCardFromDeck(), CardDeck(), handleCardExpand() (+84 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.10
Nodes (15): ref_fs_promises, ref_os, ref_sharp, OUT, tiers, files, INPUT_DIR, GET() (+7 more)

### Community 45 - "demo-routing.test.ts"
Cohesion: 0.14
Nodes (17): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie() (+9 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.06
Nodes (39): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+31 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "card-editor-polish.test.ts"
Cohesion: 0.17
Nodes (22): useWalletEvents(), connect(), disconnect(), onVisibility(), containsForbiddenTechnicalLabel(), qrVisuallySquareInPixels(), canUseSessionStorage(), getStoredLastEventId() (+14 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "customer-loyalty-overview.ts"
Cohesion: 0.07
Nodes (47): MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel(), notifyMerchantRewardProgressRefresh(), TargetBlock(), WalletHome(), activityFromWalletEvent() (+39 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.09
Nodes (37): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken() (+29 more)

### Community 52 - "ref_node_fs_promises"
Cohesion: 0.20
Nodes (4): ref_node_fs_promises, OUT, OUT, OUT

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "isGoogleWalletConfigured"
Cohesion: 0.14
Nodes (34): POST(), POST(), requireStandardUser(), isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode() (+26 more)

### Community 55 - "email.ts"
Cohesion: 0.22
Nodes (15): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+7 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.09
Nodes (38): bucketKey(), enumerateBucketKeys(), parisHour(), percentChange(), buildCohorts(), buildComparison(), buildFinancial(), buildFrequentation() (+30 more)

### Community 58 - "HourlySchedulePicker"
Cohesion: 0.15
Nodes (11): addDaysToDateInput(), formatHourRange(), HourlySchedulePicker(), addDay(), hourSelectOptions(), hoursToSlots(), scheduleDayError(), slotAmountCents() (+3 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.17
Nodes (19): CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_HISTORY, CustomerLoyaltyOverview, getProfileUser(), DEMO_LOYALTY_OVERVIEW, src_lib_demo_visual_client_demo_cookie (+11 more)

### Community 60 - "merchant-roulette.tsx"
Cohesion: 0.38
Nodes (3): LinearGauge(), MerchantFace(), MerchantRoulette()

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "preview-data.ts"
Cohesion: 0.17
Nodes (12): PREVIEW_BENEFITS, PREVIEW_CARDS, PREVIEW_PREFERENCES, PREVIEW_PROFILE, PREVIEW_PROFILE_HISTORY, BenefitEntry, formatLoyaltyEntry(), HistoryCategory (+4 more)

### Community 64 - "super-admin.test.ts"
Cohesion: 0.16
Nodes (22): GET(), BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr() (+14 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.17
Nodes (22): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), GET(), notFound() (+14 more)

### Community 66 - "caisse-client-number.test.ts"
Cohesion: 0.21
Nodes (10): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 67 - "vitest"
Cohesion: 0.04
Nodes (35): ref_fs, ref_node_fs, ref_node_path, ref_path, vitest, ref_vitest_config, outDir, outDir (+27 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "super-admin-session.ts"
Cohesion: 0.36
Nodes (9): isProduction(), cookieOptions(), createSuperAdminSession(), destroySuperAdminSession(), getRequestSuperAdminUser(), getSuperAdminUserFromToken(), hashSuperAdminToken(), isSuperAdminEmailAllowed() (+1 more)

### Community 71 - "staff-permissions.ts"
Cohesion: 0.18
Nodes (9): ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS, PERMISSION_LABELS, PermissionKey (+1 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.08
Nodes (38): CardTemplateBackground(), LoyaltyWidgetProgressInput, COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRendererProps (+30 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 75 - "ref_next_server"
Cohesion: 0.06
Nodes (23): ref_next_server, inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser, basePrefs, consentEventCreateMany (+15 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 77 - "playwright"
Cohesion: 0.20
Nodes (4): playwright, OUT, OUT, OUT

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "stripe.ts"
Cohesion: 0.17
Nodes (19): CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, constructStripeWebhookEvent(), createCampaignCheckoutSession(), createMarketingTopupCheckoutSession(), getStripeClient() (+11 more)

### Community 80 - "getSuperAdminSessionUser"
Cohesion: 0.15
Nodes (12): AuditPage(), SuperAdminAuditPage(), SuperAdminAdDetailPage(), SuperAdminCardsPage(), MerchantCardsPage(), SuperAdminMerchantDetail(), SuperAdminMerchantsPage(), ContractsPage() (+4 more)

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

### Community 86 - "super-admin/campagnes/page.tsx"
Cohesion: 0.33
Nodes (3): CampaignModerationHome(), formatCents(), SuperAdminCampagnesPage()

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (20): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+12 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "capture-employe-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

### Community 102 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 103 - "generate-pwa-icons.mjs"
Cohesion: 0.28
Nodes (8): ref_node_buffer, ref_node_zlib, chunk(), color, crc32(), outDir, png(), root

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.22
Nodes (7): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister()

### Community 105 - "ProgramConfigurator"
Cohesion: 0.23
Nodes (10): modeTitle(), ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction(), publish(), saveDraft(), unitForMode() (+2 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "api-guard.ts"
Cohesion: 0.06
Nodes (49): GET(), GET(), GET(), DELETE(), FILTER_MAP, GET(), dynamic, GET() (+41 more)

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

### Community 120 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.13
Nodes (12): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+4 more)

### Community 122 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "merchant/ads/[id]/route.ts"
Cohesion: 0.18
Nodes (16): EDITABLE_STATUSES, GET(), PATCH(), GET(), POST(), MAX_SPONSORED_DAYS, MIN_SPONSORED_DAYS, priceSponsoredHours() (+8 more)

### Community 125 - "GET"
Cohesion: 0.43
Nodes (6): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), sseChunk(), shouldSendSseEvent()

### Community 126 - "stripe-mode.test.ts"
Cohesion: 0.22
Nodes (6): stripe, constructorKeys, envMock, FakeStripe, refundsCreate, sessionsCreate

### Community 127 - "merchant-create-service.ts"
Cohesion: 0.24
Nodes (8): createMerchantCardSlots(), createMerchantFull(), CreateMerchantInput, MERCHANT_STATUS_LABELS, syncIsActiveFromStatus(), merchantFindUnique, transaction, userFindUnique

### Community 128 - "webhook/route.ts"
Cohesion: 0.38
Nodes (9): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), refundIncludedQuota() (+1 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.18
Nodes (17): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+9 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.25
Nodes (6): DiscoverPage(), Merchant, pickRotatingAd(), Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "env.ts"
Cohesion: 0.18
Nodes (6): assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), getAllowedOrigins()

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.25
Nodes (14): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+6 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "program/route.ts"
Cohesion: 0.33
Nodes (7): GET(), sortOrder(), GET(), loadProgram(), balanceFieldForUnit(), loyaltyDraftSchema, programSimulateSchema

### Community 135 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 136 - "theme-provider.tsx"
Cohesion: 0.29
Nodes (3): next-themes, THEME_COLOR, ThemeProvider()

### Community 137 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.24
Nodes (11): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert (+3 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "getEmployeeSession"
Cohesion: 0.23
Nodes (7): EmployeeLoginPage(), ProEntryPage(), SPACES, getEmployeeSession(), LandingAuthTargets, resolveLandingAuthTargets(), { getSessionUserMock, getEmployeeSessionMock }

### Community 141 - "CreateMerchantWizard"
Cohesion: 0.33
Nodes (4): CreateMerchantPage(), CreateMerchantWizard(), goNext(), stepError()

### Community 142 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 143 - "loyalty-cards-capture.mjs"
Cohesion: 0.40
Nodes (3): goto(), OUT, tiers

### Community 144 - "jsonError"
Cohesion: 0.11
Nodes (37): GET(), PATCH(), GET(), POST(), POST(), POST(), POST(), POST() (+29 more)

### Community 145 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 146 - "CampagnesPanel"
Cohesion: 0.18
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 147 - "cashier-checkout.tsx"
Cohesion: 0.18
Nodes (17): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+9 more)

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.16
Nodes (20): GET(), POST(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate() (+12 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 153 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 154 - "google-wallet.ts"
Cohesion: 0.22
Nodes (22): appLinkData(), availableRewardModules(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), GoogleWalletImage, googleWalletLogoUrl() (+14 more)

### Community 155 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 156 - "solde/ui.tsx"
Cohesion: 0.19
Nodes (14): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, formatCents() (+6 more)

### Community 157 - "capture-employe-app-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

### Community 159 - "app/statistiques/page.tsx"
Cohesion: 0.40
Nodes (3): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage()

### Community 160 - "scripts/campaign-worker.ts"
Cohesion: 0.60
Nodes (5): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick()

### Community 163 - "avatar-editor.tsx"
Cohesion: 0.47
Nodes (5): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor()

### Community 164 - "generate-google-wallet-logo.mjs"
Cohesion: 0.40
Nodes (4): ref_node_url, outDir, outFile, root

### Community 167 - "abonnements/page.tsx"
Cohesion: 0.50
Nodes (4): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight()

### Community 168 - "super-admin/page.tsx"
Cohesion: 0.40
Nodes (3): DashboardHome(), formatEuros(), SuperAdminPage()

### Community 169 - "use-editor-history.ts"
Cohesion: 0.40
Nodes (3): Action, HistoryState, useEditorHistory()

### Community 171 - "series/route.ts"
Cohesion: 0.67
Nodes (3): GET(), PERIODS, getPlatformBreakdowns()

## Knowledge Gaps
- **879 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+874 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1181 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `next-reward-styles.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `react`, `loyalty-commit.ts`, `merchant-ad-edit.test.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-test-mode-isolation.test.ts`, `google-wallet-doctor.ts`, `validation.ts`, `getEmployeeSession`, `loyalty-widget.ts`, `campaign-lifecycle.ts`, `loyalty-labels.ts`, `loyalty-context.ts`, `prisma.ts`, `card-template-schema.ts`, `push-client.ts`, `use-wallet-unlock-animation.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `loyaltyBalanceForMode`, `google-auth.ts`, `env`, `insight-period.ts`, `http.ts`, `@prisma/client`, `marketing-topup-route.test.ts`, `requireMerchantAdmin`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `card-editor-legacy-reset.test.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `wallet-home.tsx`, `ref_fs_promises`, `demo-routing.test.ts`, `theme-provider.tsx`, `card-editor-polish.test.ts`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `email.ts`, `loyalty-service.test.ts`, `super-admin.test.ts`, `caisse-client-number.test.ts`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `merchant-card-renderer.tsx`, `ref_next_server`, `unsubscribe-token.ts`, `stripe.ts`, `qr.ts`, `marketing-balance.test.ts`, `api-merchant-statistics-route.test.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `stripe-mode.test.ts`, `merchant-create-service.ts`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `lib/campaign-worker.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `react`, `program/route.ts`, `loyalty-commit.ts`, `employee-session.ts`, `loyalty-widget.ts`, `validation.ts`, `card-template-schema.ts`, `jsonOk`, `campaign-lifecycle.ts`, `loyalty-context.ts`, `prisma.ts`, `loyalty-labels.ts`, `cashier-checkout.tsx`, `use-wallet-unlock-animation.ts`, `profile-page.tsx`, `employee-invitation-service.ts`, `loyaltyBalanceForMode`, `google-auth.ts`, `google-wallet.ts`, `http.ts`, `advantages-ui.tsx`, `create-super-admin.ts`, `requireMerchantAdmin`, `CardEditorPage`, `package.json`, `wallet-home.tsx`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `preview-data.ts`, `super-admin.test.ts`, `super-admin-session.ts`, `staff-permissions.ts`, `merchant-card-renderer.tsx`, `qr.ts`, `api-guard.ts`, `cards-index.tsx`, `merchant-create-service.ts`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `discover-page.tsx`, `merchant-card-template-service.ts`, `theme-provider.tsx`, `card-template-schema.ts`, `loyalty-context.ts`, `merchant-ui.tsx`, `cashier-checkout.tsx`, `clients/ui.tsx`, `profile-page.tsx`, `use-wallet-unlock-animation.ts`, `use-media-query.ts`, `google-auth.ts`, `app/ui.tsx`, `ad-detail.tsx`, `advantages-ui.tsx`, `solde/ui.tsx`, `insight-charts.tsx`, `package.json`, `avatar-editor.tsx`, `statistiques-panel.tsx`, `google-wallet-media-crop.tsx`, `scan/ui.tsx`, `use-editor-history.ts`, `wallet-home.tsx`, `src/app/page.tsx`, `card-editor-polish.test.ts`, `customer-loyalty-overview.ts`, `merchant-roulette.tsx`, `vitest`, `merchant-card-renderer.tsx`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `notifications-center.tsx`, `cards-index.tsx`, `qa-login/page.tsx`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _879 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caisse-scan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14814814814814814 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10634920634920635 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08220211161387632 - nodes in this community are weakly interconnected._