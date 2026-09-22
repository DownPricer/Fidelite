# Graph Report - Cartefidelité  (2026-09-22)

## Corpus Check
- 582 files · ~4,718,348 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 3056 nodes · 9518 edges · 156 communities (134 shown, 22 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `edd0c477`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- jsonError
- ref_node_path
- scan/ui.tsx
- merchant-card-template-service.ts
- next
- react
- rbac.ts
- ref_next_navigation
- wallet-event-dedup.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- requireMutatingRequest
- interactive-loyalty-card.tsx
- card-editor-properties.tsx
- validation.ts
- loyalty-context.ts
- rateLimit
- card-enlarged-view.tsx
- programme/ui.tsx
- use-wallet-unlock-animation.ts
- super-admin.test.ts
- events/route.ts
- loyalty-commit.ts
- merchant-app-access.ts
- google-auth.ts
- env.ts
- employees/[id]/route.ts
- profile-page.tsx
- loyalty-program.ts
- merchant-card-renderer.tsx
- cashier-checkout.tsx
- ProgramConfigurator
- prisma.ts
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- isGoogleWalletConfigured
- ref_next_server
- What You Must Do When Invoked
- loyalty-service.ts
- media-storage.ts
- loyalty-commit.test.ts
- wallet-hydration.test.tsx
- trim-card-images.mjs
- demo-routing.test.ts
- src/app/page.tsx
- compilerOptions
- wallet-home.tsx
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
- card-deck-interaction.test.ts
- ref_next_link
- loyalty-service.test.ts
- scripts
- webhook/route.ts
- platform-stats.ts
- google-wallet/route.ts
- reward-form-dialog.tsx
- deletion/confirm/route.ts
- program/route.ts
- insight-period.ts
- generate-pwa-icons.mjs
- merchants-list.tsx
- wallet-card-template.ts
- card-template-schema.ts
- accept-invitation/route.ts
- customer-loyalty-overview.ts
- unsubscribe/route.ts
- EmployeeDetailPanel
- cn
- scan/route.ts
- landing-merchant-preview.tsx
- cartes.js
- Fidelo
- docker-entrypoint.sh
- create-super-admin.ts
- MerchantDetailPage
- @prisma/client
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- getSuperAdminSessionUser
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- api-merchant-statistics-route.test.ts
- vitest
- qr-input.ts
- CardEditorBackgroundCrop
- landing-header.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- employee-invitation-service.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- getEmployeeSession
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- employee-session.ts
- insight-definitions.ts
- CreateMerchantWizard
- ref_node_fs
- EmployeeLoginScreen
- campaign-confirm-route.test.ts
- landing-faq.tsx
- qr.ts
- qr/route.ts
- use-media-query.ts
- staff-permissions.ts
- lib/campaign-worker.ts
- notifications-center.tsx
- super-admin-session.ts
- landing-page.test.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- campaign-moderation-home.tsx
- campaign-crud-routes.test.ts
- customer-preferences-route.test.ts
- demo-visual.ts
- push-client.ts
- google-wallet-doctor.ts
- campaigns/[id]/route.ts
- customer-qr-route.test.ts
- app/ui.tsx
- discover-page.tsx
- landing-hero-visual.tsx
- campaign-quota.test.ts
- customer-notifications-route.test.ts
- customer-push-route.test.ts
- scripts/campaign-worker.ts
- csrf.ts
- capture-super-admin.mjs
- fidelisation/ui.tsx
- MerchantHome
- SettingsPanel

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 188 edges
2. `jsonOk()` - 170 edges
3. `requireMutatingRequest()` - 115 edges
4. `prisma` - 107 edges
5. `react` - 92 edges
6. `vitest` - 91 edges
7. `@prisma/client` - 88 edges
8. `clientIp()` - 88 edges
9. `userAgent()` - 84 edges
10. `readJson()` - 81 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `legacyTemplateWithoutQr()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/wallet-hydration.test.tsx → src/lib/card-template-schema.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (156 total, 22 thin omitted)

### Community 0 - "jsonError"
Cohesion: 0.07
Nodes (60): GET(), PATCH(), GET(), POST(), POST(), POST(), GET(), GET() (+52 more)

### Community 1 - "ref_node_path"
Cohesion: 0.07
Nodes (19): ref_node_fs_promises, ref_node_path, playwright, OUT, OUT, shots, outDir, goto() (+11 more)

### Community 2 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (32): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+24 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (60): PATCH(), POST(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), normalizeCardTemplateForSlot(), cardTemplateConfigSchema, convertConfigForTargetSlot(), ALL_MERCHANT_CARD_SLOTS (+52 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.09
Nodes (26): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), EmployeeInvitationScreen(), ChangePasswordPage(), LOYALTY_MODES (+18 more)

### Community 6 - "rbac.ts"
Cohesion: 0.12
Nodes (17): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canViewStatistics(), MAX_ACTIVE_EMPLOYEES (+9 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.26
Nodes (19): ref_next_navigation, CampagnesPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), MerchantHomePage() (+11 more)

### Community 8 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (20): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+12 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (34): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetView(), pct(), ProgressCircle() (+26 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (50): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), publishValidationResult() (+42 more)

### Community 11 - "requireMutatingRequest"
Cohesion: 0.15
Nodes (45): POST(), POST(), schema, POST(), POST(), POST(), POST(), POST() (+37 more)

### Community 12 - "interactive-loyalty-card.tsx"
Cohesion: 0.15
Nodes (16): InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, DEMO_TIER_DECK_ORDER, getLoyaltyCardBackground(), getLoyaltyCardTierLabel(), LOYALTY_CARD_BACKGROUNDS, LOYALTY_CARD_TIER_LABELS, LoyaltyCardTierKey (+8 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (64): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, elementLabel(), GuideLine (+56 more)

### Community 14 - "validation.ts"
Cohesion: 0.07
Nodes (35): zod, schema, POST(), schema, PATCH(), requireSuperAdminReauth(), syncIsActiveFromStatus(), createMerchantFullSchema (+27 more)

### Community 15 - "loyalty-context.ts"
Cohesion: 0.12
Nodes (28): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), ActiveMerchantLoyaltyContext, getActiveMerchantLoyaltyContextBySlug(), isMerchantOperational(), isProgramOperational() (+20 more)

### Community 16 - "rateLimit"
Cohesion: 0.15
Nodes (17): GET(), GET(), POST(), QaExchangeBody, qaJson(), qaNotFound(), dynamic, QaLoginPage() (+9 more)

### Community 17 - "card-enlarged-view.tsx"
Cohesion: 0.14
Nodes (19): ref_motion_react, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCode(), handleActivate() (+11 more)

### Community 18 - "programme/ui.tsx"
Cohesion: 0.09
Nodes (28): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel() (+20 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.18
Nodes (17): isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), cardFromUnlockPayload(), fetchUnlockCardDetail(), isUnlockCardReadyForReveal(), parseTemplateFromPayload() (+9 more)

### Community 20 - "super-admin.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 21 - "events/route.ts"
Cohesion: 0.20
Nodes (13): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), shouldSendSseEvent() (+5 more)

### Community 22 - "loyalty-commit.ts"
Cohesion: 0.16
Nodes (21): appliedTierLabel(), assembleView(), buildView(), CAISSE_GRANT_TTL_MS, commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive() (+13 more)

### Community 23 - "merchant-app-access.ts"
Cohesion: 0.29
Nodes (10): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace(), canOpenCaisse() (+2 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "env.ts"
Cohesion: 0.11
Nodes (20): env, hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), MerchantAppAccess (+12 more)

### Community 26 - "employees/[id]/route.ts"
Cohesion: 0.24
Nodes (15): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+7 more)

### Community 27 - "profile-page.tsx"
Cohesion: 0.05
Nodes (47): ref_next_font_google, next-themes, ref_react_dom_client, src_app_globals, dynamic, manrope, metadata, viewport (+39 more)

### Community 28 - "loyalty-program.ts"
Cohesion: 0.12
Nodes (32): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, evaluateEarn(), formatDurationMinutes(), minutesBetween(), progressLabelFor() (+24 more)

### Community 29 - "merchant-card-renderer.tsx"
Cohesion: 0.11
Nodes (19): LinearGauge(), LoyaltyWidgetProgressInput, MerchantCardPublicPreview(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode (+11 more)

### Community 30 - "cashier-checkout.tsx"
Cohesion: 0.09
Nodes (34): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+26 more)

### Community 31 - "ProgramConfigurator"
Cohesion: 0.23
Nodes (19): ProgramConfigurator(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+11 more)

### Community 32 - "prisma.ts"
Cohesion: 0.11
Nodes (37): POST(), POST(), POST(), GET(), GET(), serializeCampaign(), GET(), LOYALTY_MODES (+29 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (29): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+21 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (31): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+23 more)

### Community 37 - "isGoogleWalletConfigured"
Cohesion: 0.26
Nodes (12): GET(), POST(), POST(), requireStandardUser(), isGoogleWalletConfigured(), accessToken(), GoogleWalletApiError, src_lib_google_wallet_isgooglewalletconfigured (+4 more)

### Community 38 - "ref_next_server"
Cohesion: 0.12
Nodes (19): ref_next_server, GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget() (+11 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "loyalty-service.ts"
Cohesion: 0.16
Nodes (19): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), incrementBalanceData(), legacyPointsForUnitBalance(), LoyaltyBalanceFields, setActiveBalanceData(), computeLoyalty() (+11 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.08
Nodes (37): ref_fs_promises, ref_os, OUT, tiers, GET(), MIME, GET(), MIME (+29 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "wallet-hydration.test.tsx"
Cohesion: 0.12
Nodes (22): activeCardFromDeck(), CardDeck(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex(), readDeckMetrics() (+14 more)

### Community 44 - "trim-card-images.mjs"
Cohesion: 0.40
Nodes (3): ref_sharp, files, INPUT_DIR

### Community 45 - "demo-routing.test.ts"
Cohesion: 0.14
Nodes (17): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie() (+9 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.12
Nodes (21): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+13 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-home.tsx"
Cohesion: 0.10
Nodes (21): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), CustomerProgramView, MerchantCardDetail(), fallbackCopyLink(), shareCard(), notifyMerchantRewardProgressRefresh() (+13 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.14
Nodes (25): GET(), getPublishedCardTemplate(), activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft (+17 more)

### Community 50 - "qr-cache.ts"
Cohesion: 0.12
Nodes (21): ref_react_dom_server, MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey() (+13 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (29): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken() (+21 more)

### Community 52 - "caisse-client-number.test.ts"
Cohesion: 0.23
Nodes (11): findUserByCustomerNumber(), deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber(), scanSchema, fifeLifeQrTokenCreate (+3 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.13
Nodes (45): appLinkData(), assertConfigured(), availableRewardModules(), buildGoogleWalletIds(), buildGoogleWalletMerchantView(), cardUrl(), classProfileForMode(), classTemplateInfo() (+37 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (14): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+6 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (36): bucketKey(), InsightRange, percentChange(), buildCohorts(), buildComparison(), buildFinancial(), buildFrequentation(), buildOverview() (+28 more)

### Community 58 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 59 - "card-deck-interaction.test.ts"
Cohesion: 0.43
Nodes (4): handleCardExpand(), CARD_NO_EXPAND_SELECTOR, shouldIgnoreCardExpand(), shouldProceedWithCardExpand()

### Community 60 - "ref_next_link"
Cohesion: 0.12
Nodes (9): ref_next_link, SPACES, COLUMNS, isInternalPath(), LandingFooter(), MerchantCardsGallery(), slotStatusLabel(), slotTone() (+1 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "webhook/route.ts"
Cohesion: 0.09
Nodes (29): stripe, handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), POST(), isCancellable() (+21 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.24
Nodes (14): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+6 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.15
Nodes (23): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+15 more)

### Community 66 - "reward-form-dialog.tsx"
Cohesion: 0.22
Nodes (11): emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit(), rewardTypeLabel(), RewardTypeOption (+3 more)

### Community 67 - "deletion/confirm/route.ts"
Cohesion: 0.12
Nodes (22): GET(), PATCH(), DELETE(), GET(), PATCH(), AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT (+14 more)

### Community 68 - "program/route.ts"
Cohesion: 0.23
Nodes (12): GET(), sortOrder(), GET(), loadProgram(), POST(), balanceFieldForUnit(), decideRewardRemoval(), LoyaltyRewardDraft (+4 more)

### Community 69 - "insight-period.ts"
Cohesion: 0.23
Nodes (20): addParisDays(), addParisMonths(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey (+12 more)

### Community 70 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 71 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 72 - "wallet-card-template.ts"
Cohesion: 0.24
Nodes (16): resolveDisplayQrSrc(), ELEMENT_DATA_KEYS, qrVisualPixelSize(), CUSTOMER_QR_DATA_KEY, isQrTemplateElement(), listQrTemplateElements(), normalizeQrTemplateElement(), qrElementDimensionsValid() (+8 more)

### Community 73 - "card-template-schema.ts"
Cohesion: 0.12
Nodes (18): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle, CardProgressColors (+10 more)

### Community 74 - "accept-invitation/route.ts"
Cohesion: 0.14
Nodes (19): GET(), POST(), GET(), POST(), POST(), createDirectEmployee(), CreateEmployeeInput, EmployeeCreateError (+11 more)

### Community 75 - "customer-loyalty-overview.ts"
Cohesion: 0.10
Nodes (38): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, buildScanResult() (+30 more)

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.20
Nodes (12): jose, bodySchema, POST(), secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError (+4 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "cn"
Cohesion: 0.14
Nodes (18): DashboardLayout(), ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate() (+10 more)

### Community 79 - "scan/route.ts"
Cohesion: 0.19
Nodes (13): logScanBody(), POST(), scanVia(), CaisseScanError, maskClientNumberForLog(), processCaisseScanByClientNumber(), publicQrErrorMessage(), processCaisseScan (+5 more)

### Community 80 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

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
Cohesion: 0.19
Nodes (18): @prisma/client, MerchantRewardProgressPanel(), TargetBlock(), buildTargetView(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT (+10 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "getSuperAdminSessionUser"
Cohesion: 0.07
Nodes (28): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCardsPage() (+20 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.12
Nodes (12): Audience, CampagnesPanel(), CampaignSummary, CampaignWizard(), Channel, CHANNEL_LABELS, Dashboard, DEMO_DASHBOARD (+4 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 102 - "vitest"
Cohesion: 0.09
Nodes (18): ref_fs, ref_path, vitest, ref_vitest_config, main(), outDir, shot(), outDir (+10 more)

### Community 103 - "qr-input.ts"
Cohesion: 0.43
Nodes (5): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken()

### Community 105 - "landing-header.tsx"
Cohesion: 0.33
Nodes (5): MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "employee-invitation-service.ts"
Cohesion: 0.17
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

### Community 114 - "getEmployeeSession"
Cohesion: 0.23
Nodes (7): EmployeeLoginPage(), ProEntryPage(), SPACES, getEmployeeSession(), LandingAuthTargets, resolveLandingAuthTargets(), { getSessionUserMock, getEmployeeSessionMock }

### Community 118 - "employee-session.ts"
Cohesion: 0.20
Nodes (15): cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, employeeTokenFromRequest() (+7 more)

### Community 120 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 121 - "ref_node_fs"
Cohesion: 0.11
Nodes (6): ref_node_fs, outDir, outDir, outDir, LOGO_PATH, PNG_SIGNATURE

### Community 122 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.13
Nodes (15): baseCampaign, campaignFindFirst, campaignPaymentCreate, campaignUpdate, createCampaignCheckoutSession, estimateMerchantMembersAudience, estimateNetworkLocalAudience, FakeStripeNotConfiguredError (+7 more)

### Community 124 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 125 - "qr.ts"
Cohesion: 0.25
Nodes (11): main(), prisma, requiredEnv(), upsertEmployee(), processCaisseScan(), assertQrUsable(), QrError, QrPayload (+3 more)

### Community 126 - "qr/route.ts"
Cohesion: 0.26
Nodes (13): qrcode, dynamic, logCustomerQr(), POST(), runtime, schema, ensureCustomerMembershipForSlug(), ensureCustomerQrToken() (+5 more)

### Community 128 - "staff-permissions.ts"
Cohesion: 0.13
Nodes (10): DEMO_EMPLOYEE, ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS, PERMISSION_LABELS (+2 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.26
Nodes (12): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+4 more)

### Community 130 - "notifications-center.tsx"
Cohesion: 0.22
Nodes (7): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationsCenter()

### Community 131 - "super-admin-session.ts"
Cohesion: 0.36
Nodes (9): isProduction(), cookieOptions(), createSuperAdminSession(), destroySuperAdminSession(), getRequestSuperAdminUser(), getSuperAdminUserFromToken(), hashSuperAdminToken(), isSuperAdminEmailAllowed() (+1 more)

### Community 132 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.20
Nodes (8): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 134 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 135 - "campaign-moderation-home.tsx"
Cohesion: 0.28
Nodes (5): AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, SuperAdminCampagnesPage()

### Community 136 - "campaign-crud-routes.test.ts"
Cohesion: 0.22
Nodes (7): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 137 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 138 - "demo-visual.ts"
Cohesion: 0.12
Nodes (26): CarteIdentitePage(), AccountPage(), ParametresPage(), JoinMerchantPage(), PREVIEW_BENEFITS, PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE (+18 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

### Community 141 - "campaigns/[id]/route.ts"
Cohesion: 0.43
Nodes (6): DELETE(), GET(), loadOwnedCampaign(), PATCH(), CAMPAIGN_STATUS_LABELS, campaignContentSchema

### Community 142 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 143 - "app/ui.tsx"
Cohesion: 0.33
Nodes (5): HomeStats, QUICK_ACTIONS, StatsPreview, TrendMetric, TrendBadge()

### Community 144 - "discover-page.tsx"
Cohesion: 0.40
Nodes (3): DiscoverPage(), Merchant, Sponsored

### Community 145 - "landing-hero-visual.tsx"
Cohesion: 0.33
Nodes (5): CoffeeIcon(), QrCodeIcon(), WalletCardsIcon(), WifiIcon(), LandingHeroVisual()

### Community 146 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 147 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 148 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 149 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

### Community 150 - "csrf.ts"
Cohesion: 0.60
Nodes (3): assertSameOrigin(), CsrfError, getAllowedOrigins()

## Knowledge Gaps
- **744 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+739 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 991 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `lib/campaign-worker.ts`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `landing-page.test.ts`, `react`, `rbac.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-crud-routes.test.ts`, `customer-preferences-route.test.ts`, `loyalty-widget.ts`, `push-client.ts`, `loyalty-widget-view.tsx`, `card-editor-properties.tsx`, `customer-qr-route.test.ts`, `loyalty-context.ts`, `card-enlarged-view.tsx`, `campaign-quota.test.ts`, `customer-notifications-route.test.ts`, `customer-push-route.test.ts`, `use-wallet-unlock-animation.ts`, `super-admin.test.ts`, `google-auth.ts`, `env.ts`, `profile-page.tsx`, `loyalty-program.ts`, `cashier-checkout.tsx`, `prisma.ts`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `loyalty-service.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `wallet-hydration.test.tsx`, `demo-routing.test.ts`, `loyalty-program-publication.ts`, `qr-cache.ts`, `qa-login.ts`, `caisse-client-number.test.ts`, `email.ts`, `insight-stats.ts`, `caisse-scan.test.ts`, `card-deck-interaction.test.ts`, `loyalty-service.test.ts`, `webhook/route.ts`, `platform-stats.ts`, `google-wallet/route.ts`, `program/route.ts`, `insight-period.ts`, `wallet-card-template.ts`, `accept-invitation/route.ts`, `customer-loyalty-overview.ts`, `unsubscribe/route.ts`, `scan/route.ts`, `@prisma/client`, `api-merchant-statistics-route.test.ts`, `qr-input.ts`, `campaign-worker.test.ts`, `employee-invitation-service.ts`, `getEmployeeSession`, `ref_node_fs`, `campaign-confirm-route.test.ts`, `qr.ts`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `jsonError`, `lib/campaign-worker.ts`, `staff-permissions.ts`, `merchant-card-template-service.ts`, `super-admin-session.ts`, `rbac.ts`, `loyalty-widget.ts`, `requireMutatingRequest`, `demo-visual.ts`, `card-editor-properties.tsx`, `validation.ts`, `loyalty-context.ts`, `programme/ui.tsx`, `use-wallet-unlock-animation.ts`, `super-admin.test.ts`, `events/route.ts`, `loyalty-commit.ts`, `merchant-app-access.ts`, `google-auth.ts`, `env.ts`, `profile-page.tsx`, `loyalty-program.ts`, `merchant-card-renderer.tsx`, `cashier-checkout.tsx`, `prisma.ts`, `card-editor.tsx`, `package.json`, `loyalty-service.ts`, `wallet-home.tsx`, `loyalty-program-publication.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `ref_next_link`, `loyalty-service.test.ts`, `webhook/route.ts`, `platform-stats.ts`, `deletion/confirm/route.ts`, `program/route.ts`, `wallet-card-template.ts`, `accept-invitation/route.ts`, `customer-loyalty-overview.ts`, `cn`, `create-super-admin.ts`, `employee-invitation-service.ts`, `employee-session.ts`, `qr.ts`, `qr/route.ts`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `scan/ui.tsx`, `merchant-card-template-service.ts`, `notifications-center.tsx`, `campaign-moderation-home.tsx`, `wallet-event-dedup.ts`, `loyalty-widget-view.tsx`, `interactive-loyalty-card.tsx`, `card-editor-properties.tsx`, `app/ui.tsx`, `rateLimit`, `card-enlarged-view.tsx`, `programme/ui.tsx`, `discover-page.tsx`, `use-wallet-unlock-animation.ts`, `profile-page.tsx`, `merchant-card-renderer.tsx`, `cashier-checkout.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `wallet-hydration.test.tsx`, `wallet-home.tsx`, `qr-cache.ts`, `ref_next_link`, `reward-form-dialog.tsx`, `merchants-list.tsx`, `card-template-schema.ts`, `cn`, `@prisma/client`, `getSuperAdminSessionUser`, `campagnes/ui.tsx`, `landing-header.tsx`, `landing-faq.tsx`, `use-media-query.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _744 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `jsonError` be split into smaller, more focused modules?**
  _Cohesion score 0.06792058516196448 - nodes in this community are weakly interconnected._
- **Should `ref_node_path` be split into smaller, more focused modules?**
  _Cohesion score 0.07073170731707316 - nodes in this community are weakly interconnected._
- **Should `scan/ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13414634146341464 - nodes in this community are weakly interconnected._