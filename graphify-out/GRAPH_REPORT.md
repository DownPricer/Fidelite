# Graph Report - Cartefidelité  (2026-09-22)

## Corpus Check
- 521 files · ~4,692,877 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 2722 nodes · 8476 edges · 132 communities (104 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `098afb41`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- jsonError
- ref_node_path
- scan/ui.tsx
- merchant-card-template-service.ts
- next
- react
- buildGoogleWalletMerchantView
- rbac.ts
- wallet-home.tsx
- loyalty-widget-view.tsx
- loyalty-widget.ts
- requireMutatingRequest
- interactive-loyalty-card.tsx
- card-editor-canvas.tsx
- validation.ts
- loyalty-context.ts
- super-admin/auth/login/route.ts
- card-enlarged-view.tsx
- cn
- use-wallet-unlock-animation.ts
- super-admin.test.ts
- caisse-scan.ts
- loyalty-commit.ts
- events/route.ts
- google-auth.ts
- middleware.ts
- employees/[id]/route.ts
- demo-visual.ts
- loyalty-program.ts
- merchant-card-renderer.tsx
- types.ts
- ProgramConfigurator
- api-guard.ts
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- jsonOk
- demo-session.ts
- What You Must Do When Invoked
- loyalty-service.ts
- media-storage.ts
- loyalty-commit.test.ts
- env.ts
- ref_fs
- demo-mode.ts
- src/app/page.tsx
- compilerOptions
- customer-loyalty-overview.ts
- loyalty-program-publication.ts
- qr-cache.ts
- qa-login.ts
- caisse-client-number.test.ts
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- caisse-scan.test.ts
- card-deck.tsx
- merchant-cards-gallery.tsx
- loyalty-service.test.ts
- scripts
- google-wallet-media-route.test.ts
- insight-period.ts
- google-wallet/route.ts
- programme/ui.tsx
- src/app/layout.tsx
- vitest
- qr.ts
- generate-pwa-icons.mjs
- merchants-list.tsx
- customer-qr.ts
- card-template-schema.ts
- register/route.ts
- loyaltyBalanceForMode
- qa-login/page.tsx
- card-editor-properties.tsx
- google-wallet-doctor.ts
- caisse-scan-route.test.ts
- customer-qr-route.test.ts
- cartes.js
- Fidelo
- docker-entrypoint.sh
- create-super-admin.ts
- MerchantDetailPage
- @prisma/client
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- super-admin-session.ts
- progress-ring.tsx
- semi-gauge.tsx
- cards-index.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- statistics/route.ts
- capture-employe-app-screenshots.mjs
- capture-employe-screenshots.mjs
- CardEditorBackgroundCrop
- graphify reference: query, path, explain
- employee-invitation-service.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- employee-session.ts
- insight-definitions.ts
- CreateMerchantWizard
- landing-page.test.ts
- avatar-storage.ts
- use-media-query.ts
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
1. `jsonError()` - 148 edges
2. `jsonOk()` - 130 edges
3. `next` - 112 edges
4. `requireMutatingRequest()` - 91 edges
5. `react` - 88 edges
6. `prisma` - 85 edges
7. `@prisma/client` - 82 edges
8. `vitest` - 74 edges
9. `clientIp()` - 74 edges
10. `userAgent()` - 70 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `legacyTemplateWithoutQr()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/wallet-hydration.test.tsx → src/lib/card-template-schema.ts
- `templateWithExistingQr()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/wallet-hydration.test.tsx → src/lib/card-template-schema.ts
- `mockLoyaltyContext()` --calls--> `loyaltyUnitForMode()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-labels.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (132 total, 28 thin omitted)

### Community 0 - "jsonError"
Cohesion: 0.11
Nodes (29): GET(), PATCH(), GET(), POST(), POST(), GET(), DELETE(), FILTER_MAP (+21 more)

### Community 1 - "ref_node_path"
Cohesion: 0.05
Nodes (28): ref_node_fs, ref_node_path, ref_node_url, playwright, OUT, OUT, shots, outDir (+20 more)

### Community 2 - "scan/ui.tsx"
Cohesion: 0.06
Nodes (60): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+52 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (53): LegacyCardEditorRedirect(), CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), cardSlotForLoyaltyMode(), isLoyaltyProgramSlot() (+45 more)

### Community 4 - "next"
Cohesion: 0.06
Nodes (9): nextConfig, next, SPACES, EmployeeLoginScreen(), onSubmit(), readApiJson(), metadata, viewport (+1 more)

### Community 5 - "react"
Cohesion: 0.09
Nodes (25): react, PasswordSection(), Merchant, MerchantPublic(), EmployeeInvitationScreen(), ChangePasswordPage(), LOYALTY_MODES, STEPS (+17 more)

### Community 6 - "buildGoogleWalletMerchantView"
Cohesion: 0.28
Nodes (16): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData() (+8 more)

### Community 7 - "rbac.ts"
Cohesion: 0.06
Nodes (56): CaissePage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), EmployeeDetailPanel(), patchEmployee(), reactivate() (+48 more)

### Community 8 - "wallet-home.tsx"
Cohesion: 0.12
Nodes (25): AddToGoogleWalletButton(), CardsSheet(), WalletEventPayload, useWalletEvents(), connect(), disconnect(), onVisibility(), WalletQrAction() (+17 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.10
Nodes (22): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyGaugeThumbnail(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+14 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (46): LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, missingWidgetLabel(), publishValidationResult(), summarizeEditorValidation(), CardLoyaltyWidgetConfig (+38 more)

### Community 11 - "requireMutatingRequest"
Cohesion: 0.18
Nodes (36): POST(), POST(), POST(), POST(), POST(), schema, DELETE(), POST() (+28 more)

### Community 12 - "interactive-loyalty-card.tsx"
Cohesion: 0.10
Nodes (28): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, resolveTier() (+20 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.11
Nodes (42): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+34 more)

### Community 14 - "validation.ts"
Cohesion: 0.07
Nodes (42): POST(), POST(), GET(), POST(), GET(), POST(), requireCaisse(), requireCaissePermission() (+34 more)

### Community 15 - "loyalty-context.ts"
Cohesion: 0.16
Nodes (24): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), ActiveMerchantLoyaltyContext, isMerchantOperational(), isProgramOperational(), logContext() (+16 more)

### Community 16 - "super-admin/auth/login/route.ts"
Cohesion: 0.12
Nodes (30): POST(), POST(), POST(), dynamic, logCustomerQr(), POST(), runtime, schema (+22 more)

### Community 17 - "card-enlarged-view.tsx"
Cohesion: 0.13
Nodes (20): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), ExpandableQrCode(), handleActivate(), openQr() (+12 more)

### Community 18 - "cn"
Cohesion: 0.10
Nodes (27): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel() (+19 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.24
Nodes (15): isDocumentVisible(), useWalletUnlockAnimation(), flushWhenVisible(), hasRenderReadyTemplate(), cardFromUnlockPayload(), fetchUnlockCardDetail(), isUnlockCardReadyForReveal(), parseTemplateFromPayload() (+7 more)

### Community 20 - "super-admin.test.ts"
Cohesion: 0.15
Nodes (22): GET(), BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr() (+14 more)

### Community 21 - "caisse-scan.ts"
Cohesion: 0.28
Nodes (12): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+4 more)

### Community 22 - "loyalty-commit.ts"
Cohesion: 0.13
Nodes (29): assertEarnProgramRules(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), evaluateCustomerRewards(), isMerchantActive() (+21 more)

### Community 23 - "events/route.ts"
Cohesion: 0.19
Nodes (12): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), shouldSendSseEvent() (+4 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.10
Nodes (31): GET(), GET(), AppLoginPage(), CustomerLoginPage(), CustomerLoginForm(), googleMessage(), JoinMerchantPage(), isGoogleAuthConfigured() (+23 more)

### Community 25 - "middleware.ts"
Cohesion: 0.17
Nodes (17): hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), assertSuperAdminProductionConfig(), hasSuperAdminEntryCookie() (+9 more)

### Community 26 - "employees/[id]/route.ts"
Cohesion: 0.25
Nodes (14): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+6 more)

### Community 27 - "demo-visual.ts"
Cohesion: 0.05
Nodes (65): GET(), CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_CARDS, PREVIEW_HISTORY, PREVIEW_PREFERENCES (+57 more)

### Community 28 - "loyalty-program.ts"
Cohesion: 0.08
Nodes (39): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes(), LoyaltyAction (+31 more)

### Community 29 - "merchant-card-renderer.tsx"
Cohesion: 0.12
Nodes (33): CardTemplateBackground(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps (+25 more)

### Community 30 - "types.ts"
Cohesion: 0.16
Nodes (8): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList(), ScanResultCardPayload

### Community 31 - "ProgramConfigurator"
Cohesion: 0.23
Nodes (19): ProgramConfigurator(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+11 more)

### Community 32 - "api-guard.ts"
Cohesion: 0.16
Nodes (12): POST(), GET(), GET(), dynamic, LOYALTY_MODES, globalForPrisma, prisma, cookieOptions() (+4 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (34): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+26 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (23): description, engines, node, name, prisma, seed, private, version (+15 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.07
Nodes (33): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+25 more)

### Community 37 - "jsonOk"
Cohesion: 0.15
Nodes (23): POST(), GET(), GET(), GET(), sortOrder(), GET(), GET(), GET() (+15 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.19
Nodes (16): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), applyDemoRoleCookies() (+8 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "loyalty-service.ts"
Cohesion: 0.17
Nodes (17): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), incrementBalanceData(), legacyPointsForUnitBalance(), LoyaltyBalanceFields, setActiveBalanceData(), computeLoyalty() (+9 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.11
Nodes (28): GET(), MIME, GET(), notFound(), appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot() (+20 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "env.ts"
Cohesion: 0.10
Nodes (10): assertSameOrigin(), CsrfError, CLIENT_DEMO_COOKIE, DemoRole, isMerchantDemoCookieValue(), merchantDemoActiveFromRequest(), env, getAllowedOrigins() (+2 more)

### Community 44 - "ref_fs"
Cohesion: 0.12
Nodes (10): ref_fs, ref_path, ref_sharp, outDir, OUT, shots, OUT, tiers (+2 more)

### Community 45 - "demo-mode.ts"
Cohesion: 0.18
Nodes (14): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE (+6 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.06
Nodes (42): next-themes, BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS (+34 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "customer-loyalty-overview.ts"
Cohesion: 0.09
Nodes (35): CustomerProgramView, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel(), notifyMerchantRewardProgressRefresh(), WalletHome(), activityFromWalletEvent() (+27 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "qr-cache.ts"
Cohesion: 0.16
Nodes (18): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr() (+10 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (29): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken() (+21 more)

### Community 52 - "caisse-client-number.test.ts"
Cohesion: 0.26
Nodes (10): deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 53 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+9 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.16
Nodes (30): accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue(), ensureGlobalClassRecord() (+22 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (12): nodemailer, buildInvitationContent(), emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry(), isEmailConfigured() (+4 more)

### Community 56 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+7 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (32): InsightRange, percentChange(), buildCohorts(), buildFinancial(), buildOverview(), buildRetention(), buildRewards(), buildSegments() (+24 more)

### Community 58 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 59 - "card-deck.tsx"
Cohesion: 0.20
Nodes (12): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+4 more)

### Community 60 - "merchant-cards-gallery.tsx"
Cohesion: 0.33
Nodes (5): MerchantCardsPage(), MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass()

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+5 more)

### Community 63 - "google-wallet-media-route.test.ts"
Cohesion: 0.29
Nodes (3): ref_os, loadRoute(), PNG_BYTES

### Community 64 - "insight-period.ts"
Cohesion: 0.22
Nodes (23): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+15 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.15
Nodes (24): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+16 more)

### Community 66 - "programme/ui.tsx"
Cohesion: 0.11
Nodes (21): DEMO_CONFIG, HistoricalEntitlement, MODES, modeTitle(), PROGRAM_STEP_TARGETS, PROGRAM_STEPS, publishedMinimumPurchaseLabel(), emptyReward() (+13 more)

### Community 67 - "src/app/layout.tsx"
Cohesion: 0.15
Nodes (8): src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR, ThemeProvider()

### Community 68 - "vitest"
Cohesion: 0.24
Nodes (6): vitest, decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval(), baseLookup

### Community 69 - "qr.ts"
Cohesion: 0.24
Nodes (11): main(), prisma, requiredEnv(), upsertEmployee(), jose, assertQrUsable(), QrError, QrPayload (+3 more)

### Community 70 - "generate-pwa-icons.mjs"
Cohesion: 0.28
Nodes (8): ref_node_buffer, ref_node_zlib, chunk(), color, crc32(), outDir, png(), root

### Community 71 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 72 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 73 - "card-template-schema.ts"
Cohesion: 0.11
Nodes (25): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), CardDecorativeStyle, cardElementSchema, CardLogoStyle (+17 more)

### Community 74 - "register/route.ts"
Cohesion: 0.12
Nodes (20): zod, schema, POST(), schema, POST(), schema, createDirectEmployee(), CreateEmployeeInput (+12 more)

### Community 75 - "loyaltyBalanceForMode"
Cohesion: 0.15
Nodes (26): main(), dynamic, GET(), GET(), CarteIndexPage(), dynamic, CardPage(), dynamic (+18 more)

### Community 76 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 77 - "card-editor-properties.tsx"
Cohesion: 0.11
Nodes (25): CardEditorProperties(), patchRect(), REQUIRED_BY_SLOT, TEXT_TYPES, NextRewardStylePicker(), qrOverlapsOthers(), BACKGROUND_FIT_LABELS, containsForbiddenTechnicalLabel() (+17 more)

### Community 78 - "google-wallet-doctor.ts"
Cohesion: 0.39
Nodes (8): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl()

### Community 79 - "caisse-scan-route.test.ts"
Cohesion: 0.29
Nodes (5): processCaisseScan, processCaisseScanByClientNumber, requireCaisse, requireMutatingRequest, writeAudit

### Community 80 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fidelo"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fidelo, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 85 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 86 - "@prisma/client"
Cohesion: 0.15
Nodes (22): @prisma/client, TargetBlock(), buildTargetView(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState (+14 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "super-admin-session.ts"
Cohesion: 0.11
Nodes (22): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCardsPage(), SuperAdminMerchantDetail() (+14 more)

### Community 93 - "cards-index.tsx"
Cohesion: 0.09
Nodes (22): recharts, ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate() (+14 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "statistics/route.ts"
Cohesion: 0.15
Nodes (12): GET(), PERIOD_KEYS, InsightPeriodKey, getLockedInsightPlaceholder(), findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium (+4 more)

### Community 102 - "capture-employe-app-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

### Community 103 - "capture-employe-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 108 - "employee-invitation-service.ts"
Cohesion: 0.19
Nodes (16): employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR (+8 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 118 - "employee-session.ts"
Cohesion: 0.19
Nodes (17): cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, employeeTokenFromRequest() (+9 more)

### Community 120 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 121 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 123 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

## Knowledge Gaps
- **628 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+623 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 862 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `jsonError`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `react`, `rbac.ts`, `wallet-home.tsx`, `interactive-loyalty-card.tsx`, `cn`, `google-auth.ts`, `middleware.ts`, `demo-visual.ts`, `types.ts`, `api-guard.ts`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `demo-session.ts`, `media-storage.ts`, `env.ts`, `demo-mode.ts`, `src/app/page.tsx`, `customer-loyalty-overview.ts`, `merchant-cards-gallery.tsx`, `programme/ui.tsx`, `src/app/layout.tsx`, `merchants-list.tsx`, `loyaltyBalanceForMode`, `qa-login/page.tsx`, `caisse-scan-route.test.ts`, `customer-qr-route.test.ts`, `super-admin-session.ts`, `cards-index.tsx`, `statistics/route.ts`, `employee-session.ts`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `scan/ui.tsx`, `merchant-card-template-service.ts`, `rbac.ts`, `wallet-home.tsx`, `loyalty-widget.ts`, `requireMutatingRequest`, `card-editor-canvas.tsx`, `loyalty-context.ts`, `super-admin/auth/login/route.ts`, `use-wallet-unlock-animation.ts`, `super-admin.test.ts`, `loyalty-commit.ts`, `events/route.ts`, `google-auth.ts`, `demo-visual.ts`, `loyalty-program.ts`, `merchant-card-renderer.tsx`, `types.ts`, `api-guard.ts`, `card-editor.tsx`, `package.json`, `jsonOk`, `loyalty-service.ts`, `env.ts`, `customer-loyalty-overview.ts`, `loyalty-program-publication.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `merchant-cards-gallery.tsx`, `loyalty-service.test.ts`, `programme/ui.tsx`, `vitest`, `qr.ts`, `customer-qr.ts`, `register/route.ts`, `loyaltyBalanceForMode`, `card-editor-properties.tsx`, `create-super-admin.ts`, `super-admin-session.ts`, `cards-index.tsx`, `employee-invitation-service.ts`, `employee-session.ts`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `scan/ui.tsx`, `merchant-card-template-service.ts`, `wallet-home.tsx`, `loyalty-widget-view.tsx`, `interactive-loyalty-card.tsx`, `card-editor-canvas.tsx`, `card-enlarged-view.tsx`, `cn`, `use-wallet-unlock-animation.ts`, `demo-visual.ts`, `merchant-card-renderer.tsx`, `types.ts`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `src/app/page.tsx`, `customer-loyalty-overview.ts`, `qr-cache.ts`, `card-deck.tsx`, `merchant-cards-gallery.tsx`, `programme/ui.tsx`, `src/app/layout.tsx`, `merchants-list.tsx`, `qa-login/page.tsx`, `card-editor-properties.tsx`, `@prisma/client`, `super-admin-session.ts`, `cards-index.tsx`, `use-media-query.ts`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _628 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `jsonError` be split into smaller, more focused modules?**
  _Cohesion score 0.10960960960960961 - nodes in this community are weakly interconnected._
- **Should `ref_node_path` be split into smaller, more focused modules?**
  _Cohesion score 0.04659498207885305 - nodes in this community are weakly interconnected._
- **Should `scan/ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05727848101265823 - nodes in this community are weakly interconnected._