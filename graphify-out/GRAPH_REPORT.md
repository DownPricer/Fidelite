# Graph Report - Cartefidelité  (2026-10-03)

## Corpus Check
- 723 files · ~4,807,768 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 4022 nodes · 12558 edges · 193 communities (159 shown, 34 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `032ee677`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- loyalty-labels.ts
- next
- merchant-card-template-service.ts
- ouvrir/route.ts
- react
- loyalty-program.ts
- stripe.ts
- google-wallet-appearance.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-canvas.tsx
- api-guard.ts
- @prisma/client
- loyalty-service.ts
- insight-period.ts
- [id]/merchant-detail.tsx
- ad-visual-workflow.ts
- clients/ui.tsx
- jsonError
- super-admin.test.ts
- google-wallet.ts
- google-auth.ts
- middleware.ts
- webhook/route.ts
- prisma.ts
- fiche.tsx
- sponsored-placements.test.ts
- customer-loyalty-overview.ts
- lib/campaign-worker.ts
- programme/ui.tsx
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- stripe-webhook-marketing.test.ts
- media-storage.ts
- loyalty-commit.test.ts
- solde/ui.tsx
- loyalty-commit.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- wallet-home.tsx
- loyalty-program-publication.ts
- card-editor-properties.tsx
- qa-login.ts
- ref_node_path
- dependencies
- loyalty-context.ts
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- sponsored-test-broadcast.ts
- card-enlarged-view.tsx
- AdDetailPage
- scripts
- facturation/ui.tsx
- platform-stats.ts
- demo-routing.test.ts
- interactive-loyalty-card.tsx
- vitest
- google-wallet/route.ts
- stripe-webhook-route.test.ts
- fake-ad-db.ts
- demo-visual.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- cn
- qr-cache.ts
- unsubscribe-token.ts
- marketing-topup-route.test.ts
- requireMerchantAdmin
- app/app/connexion/page.tsx
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- MerchantCampaignFiche
- profile/route.ts
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- session.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- customer/history/route.ts
- hosts.ts
- src/app/layout.tsx
- [kind]/route.ts
- generate-pwa-icons.mjs
- graphify reference: query, path, explain
- campaign-worker.test.ts
- layout-client.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- tarifs/page.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- env.ts
- ad-confirm-route.test.ts
- use-wallet-unlock-animation.ts
- campaign-confirm-route.test.ts
- profile-shared.tsx
- employee-session.ts
- sponsored-hours-pricing.ts
- HourlySchedulePicker
- card-deck.tsx
- scan/ui.tsx
- EmployeeDetailPanel
- app/ui.tsx
- employee-invitation-service.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- employe/layout.tsx
- cards-index.tsx
- landing-page.test.ts
- sponsored-test-broadcast.test.ts
- push-client.ts
- campaign-moderation-home.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- sponsored-banner.tsx
- qa-login/page.tsx
- caisse-scan-route.test.ts
- campaign-test-mode-isolation.test.ts
- loyalty-service.test.ts
- SettingsPage
- types.ts
- scripts/campaign-worker.ts
- profile-page.tsx
- CreateMerchantWizard
- parametres/ui.tsx
- sponsored-slot.tsx
- finalisation/page.tsx
- hashToken
- CampagnesPanel
- push.ts
- campaign-audience.test.ts
- ad-detail.tsx
- landing-hero-visual.tsx
- caisse-scan.test.ts
- loyalty-reward-removal.ts
- customer-preferences-route.test.ts
- marketing-balance.test.ts
- sponsored-selection.ts
- api-merchant-statistics-route.test.ts
- landing-faq.tsx
- avatar-storage.ts
- super-admin-ad-moderation.test.ts
- insight-permissions.test.ts
- insight-demo-data.ts
- card-template-schema.ts
- FramingTool
- campaign-quota.test.ts
- landing-footer.tsx
- landing-header.tsx
- landing-merchant-preview.tsx
- use-media-query.ts
- carte/avantages/page.tsx
- super-admin/layout.tsx
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
1. `jsonError()` - 261 edges
2. `jsonOk()` - 227 edges
3. `requireMutatingRequest()` - 163 edges
4. `next` - 161 edges
5. `prisma` - 148 edges
6. `vitest` - 126 edges
7. `clientIp()` - 119 edges
8. `readJson()` - 114 edges
9. `react` - 113 edges
10. `userAgent()` - 108 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveStripeMode()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `isPaymentAllowedForMerchant()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (193 total, 34 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.27
Nodes (10): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScanByClientNumber(), deriveClientNumber(), normalizeClientNumber(), normalizeCustomerNumber() (+2 more)

### Community 1 - "loyalty-labels.ts"
Cohesion: 0.14
Nodes (26): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot (+18 more)

### Community 2 - "next"
Cohesion: 0.07
Nodes (49): nextConfig, next, CaissePage(), CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), ClientsPage() (+41 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (65): runResetAction(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass(), normalizeCardTemplateForSlot() (+57 more)

### Community 4 - "ouvrir/route.ts"
Cohesion: 0.22
Nodes (8): GET(), GET(), computeAdLifecycleStatus(), isSafeAdUrl(), isWithinUtcIntervals(), UtcInterval, adEventCreate, adRequestFindUnique

### Community 5 - "react"
Cohesion: 0.06
Nodes (35): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), recoverMessage(), metadata, ContactForm() (+27 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.10
Nodes (37): assertEarnProgramRules(), block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes() (+29 more)

### Community 7 - "stripe.ts"
Cohesion: 0.05
Nodes (60): stripe, GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult (+52 more)

### Community 8 - "google-wallet-appearance.ts"
Cohesion: 0.16
Nodes (11): contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS, GoogleWalletAppearance, googleWalletAppearanceSchema, googleWalletButtonLabelSchema, GoogleWalletConfigMap, googleWalletHexSchema, isReadableGoogleWalletColor() (+3 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (32): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+24 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (45): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), publishValidationResult() (+37 more)

### Community 11 - "validation.ts"
Cohesion: 0.05
Nodes (60): zod, schema, schema, GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET() (+52 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.11
Nodes (42): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+34 more)

### Community 14 - "api-guard.ts"
Cohesion: 0.07
Nodes (39): POST(), dynamic, dynamic, dynamic, GET(), GET(), PERIOD_KEYS, GET() (+31 more)

### Community 15 - "@prisma/client"
Cohesion: 0.12
Nodes (28): @prisma/client, buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState (+20 more)

### Community 16 - "loyalty-service.ts"
Cohesion: 0.15
Nodes (22): GET(), sortOrder(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), balanceFieldForUnit(), incrementBalanceData(), legacyPointsForUnitBalance() (+14 more)

### Community 17 - "insight-period.ts"
Cohesion: 0.23
Nodes (20): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, PARIS_TZ (+12 more)

### Community 18 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 19 - "ad-visual-workflow.ts"
Cohesion: 0.10
Nodes (37): EDITABLE_STATUSES, GET(), PATCH(), POST(), schema, POST(), schema, PATCH() (+29 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "jsonError"
Cohesion: 0.07
Nodes (87): GET(), PATCH(), GET(), POST(), POST(), POST(), POST(), POST() (+79 more)

### Community 22 - "super-admin.test.ts"
Cohesion: 0.16
Nodes (17): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+9 more)

### Community 23 - "google-wallet.ts"
Cohesion: 0.11
Nodes (52): isGoogleWalletConfigured(), accessToken(), appLinkData(), assertConfigured(), availableRewardModules(), buildGoogleWalletIds(), buildGoogleWalletMerchantView(), cardUrl() (+44 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.11
Nodes (29): GET(), GET(), CustomerLoginPage(), CustomerSignupPage(), CustomerSignupForm(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl() (+21 more)

### Community 25 - "middleware.ts"
Cohesion: 0.14
Nodes (22): isProduction(), hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), legacyRedirectOrigin() (+14 more)

### Community 26 - "webhook/route.ts"
Cohesion: 0.13
Nodes (24): POST(), DELETE(), GET(), loadOwnedCampaign(), handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed() (+16 more)

### Community 27 - "prisma.ts"
Cohesion: 0.09
Nodes (62): POST(), POST(), schema, logScanBody(), POST(), scanVia(), POST(), GET() (+54 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.13
Nodes (19): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block (+11 more)

### Community 29 - "sponsored-placements.test.ts"
Cohesion: 0.16
Nodes (16): GET(), previewResponse(), withResolvedImage(), resolveSponsoredImageUrl(), loadAdPreviewCard(), parsePlacement(), selectSponsoredForCustomer(), click() (+8 more)

### Community 30 - "customer-loyalty-overview.ts"
Cohesion: 0.09
Nodes (30): CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel() (+22 more)

### Community 31 - "lib/campaign-worker.ts"
Cohesion: 0.23
Nodes (15): AudienceEstimate, estimatedForChannel(), estimateNetworkLocalAudience(), networkAudienceWhere(), backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete() (+7 more)

### Community 32 - "programme/ui.tsx"
Cohesion: 0.15
Nodes (14): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+6 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.10
Nodes (29): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), saveDraft() (+21 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.09
Nodes (31): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+23 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.13
Nodes (22): CarteLayout(), CompteLayout(), NotificationsLayout(), enforceCustomerWalletAccess(), beginCustomerOnboarding(), CustomerAccessLevel, CustomerOnboardingUser, customerWalletGuardRedirect() (+14 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.11
Nodes (32): GET(), MIME, GET(), MIME, appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), assertPublishedGoogleWalletMediaReadable(), deleteCampaignMedia() (+24 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "solde/ui.tsx"
Cohesion: 0.15
Nodes (16): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, estimateSponsorPricing() (+8 more)

### Community 44 - "loyalty-commit.ts"
Cohesion: 0.09
Nodes (42): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+34 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.15
Nodes (19): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+11 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.11
Nodes (23): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+15 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-home.tsx"
Cohesion: 0.12
Nodes (29): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), WalletEventPayload, usePersonalizedQr(), useSponsoredAvailable(), useWalletEvents(), connect() (+21 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "card-editor-properties.tsx"
Cohesion: 0.11
Nodes (23): CardEditorProperties(), patchRect(), REQUIRED_BY_SLOT, TEXT_TYPES, NextRewardStylePicker(), qrOverlapsOthers(), BACKGROUND_FIT_LABELS, containsForbiddenTechnicalLabel() (+15 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (31): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken() (+23 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (36): ref_node_fs, ref_node_path, ref_node_url, playwright, outDir, pages, OUT, OUT (+28 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "loyalty-context.ts"
Cohesion: 0.13
Nodes (30): main(), dynamic, GET(), GET(), LOYALTY_MODES, GET(), CarteIndexPage(), dynamic (+22 more)

### Community 55 - "email.ts"
Cohesion: 0.17
Nodes (26): nodemailer, ContactPage(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint() (+18 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (36): bucketKey(), enumerateBucketKeys(), InsightRange, buildCohorts(), buildComparison(), buildFinancial(), buildFrequentation(), buildOverview() (+28 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.11
Nodes (10): MobilePlacementPreview(), resetSponsoredSessionState(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer (+2 more)

### Community 59 - "sponsored-test-broadcast.ts"
Cohesion: 0.14
Nodes (29): DELETE(), GET(), POST(), buildGlobalWalletValueAddedModule(), globalWalletCampaignDetailUri(), GlobalWalletCampaignModule, localized(), resolveGlobalWalletCampaignHeroUrl() (+21 more)

### Community 60 - "card-enlarged-view.tsx"
Cohesion: 0.10
Nodes (22): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), DiscoverPage(), Merchant (+14 more)

### Community 61 - "AdDetailPage"
Cohesion: 0.22
Nodes (14): AdDetailPage(), confirmReason(), patch(), requestSend(), run(), sendProposal(), startTestBroadcast(), stopTestBroadcast() (+6 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "demo-routing.test.ts"
Cohesion: 0.15
Nodes (13): CaisseAliasPage(), EmployeeHomePage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE, src_lib_employee_demo_employee_demo_cookie (+5 more)

### Community 66 - "interactive-loyalty-card.tsx"
Cohesion: 0.10
Nodes (29): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, resolveTier() (+21 more)

### Community 67 - "vitest"
Cohesion: 0.05
Nodes (30): ref_fs, ref_path, vitest, main(), outDir, shot(), outDir, main() (+22 more)

### Community 68 - "google-wallet/route.ts"
Cohesion: 0.10
Nodes (27): POST(), dynamic, logCustomerQr(), POST(), runtime, schema, GET(), GET() (+19 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "fake-ad-db.ts"
Cohesion: 0.13
Nodes (18): END, fake, h, previewCall(), START, END, fake, START (+10 more)

### Community 71 - "demo-visual.ts"
Cohesion: 0.13
Nodes (19): CarteIdentitePage(), PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, CustomerLoyaltyOverview, PreferencesPayload, DEMO_LOYALTY_OVERVIEW, CLIENT_DEMO_COOKIE (+11 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.11
Nodes (36): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+28 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "cn"
Cohesion: 0.07
Nodes (37): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), FidelisationPanel(), icons (+29 more)

### Community 75 - "qr-cache.ts"
Cohesion: 0.12
Nodes (20): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce (+12 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 77 - "marketing-topup-route.test.ts"
Cohesion: 0.08
Nodes (17): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser, pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest (+9 more)

### Community 78 - "requireMerchantAdmin"
Cohesion: 0.12
Nodes (48): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, POST() (+40 more)

### Community 79 - "app/app/connexion/page.tsx"
Cohesion: 0.39
Nodes (6): AppLoginPage(), formatEurosFromCents(), isMerchantPlanId(), MERCHANT_PLANS, MerchantPlan, MerchantPlanId

### Community 80 - "super-admin-session.ts"
Cohesion: 0.05
Nodes (43): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), Check (+35 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "MerchantCampaignFiche"
Cohesion: 0.35
Nodes (10): api(), MerchantCampaignFiche(), addSources(), onFile(), onFramed(), post(), onFileChosen(), isExactBanner() (+2 more)

### Community 85 - "profile/route.ts"
Cohesion: 0.35
Nodes (11): GET(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_PROFILE_HISTORY, ensureCustomerPreferences(), getProfileUser(), serializePreferences() (+3 more)

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.14
Nodes (15): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, h, jsonRequest() (+7 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "session.ts"
Cohesion: 0.22
Nodes (11): GET(), GET(), dynamic, MerchantProfilePage(), dynamic, NotificationsPage(), JoinMerchantPage(), getPublishedCardTemplate() (+3 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (23): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+15 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "customer/history/route.ts"
Cohesion: 0.24
Nodes (10): FILTER_MAP, GET(), BenefitEntry, formatFifeLifeEntry(), formatLoyaltyEntry(), HistoryCategory, HistoryEntry, mapLoyaltyCategory() (+2 more)

### Community 102 - "hosts.ts"
Cohesion: 0.18
Nodes (19): createRawCustomerToken(), CUSTOMER_TOKEN_TTL, invalidateCustomerAccessTokens(), issueCustomerAccessToken(), buildAccountRecoveryUrl(), buildEmailVerificationUrl(), requestAccountRecovery(), sendCustomerFinalizationInvite() (+11 more)

### Community 103 - "src/app/layout.tsx"
Cohesion: 0.14
Nodes (9): next-themes, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 104 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 105 - "generate-pwa-icons.mjs"
Cohesion: 0.28
Nodes (8): ref_node_buffer, ref_node_zlib, chunk(), color, crc32(), outDir, png(), root

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "layout-client.tsx"
Cohesion: 0.21
Nodes (8): DashboardLayout(), AppNav(), icons, isActive(), TOOLS_PREFIXES, BellItem, formatWhen(), NotificationBell()

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "tarifs/page.tsx"
Cohesion: 0.18
Nodes (9): HomePage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, resolveLandingAuthTargets() (+1 more)

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "env.ts"
Cohesion: 0.09
Nodes (18): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), dynamic, robots() (+10 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "use-wallet-unlock-animation.ts"
Cohesion: 0.13
Nodes (22): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), isDocumentVisible() (+14 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "profile-shared.tsx"
Cohesion: 0.28
Nodes (11): APP_VERSION, APPEARANCE_OPTIONS, AppearanceRow(), demoQuery(), EditField, fieldLabels, PasswordStrength(), ProfileShell() (+3 more)

### Community 125 - "employee-session.ts"
Cohesion: 0.20
Nodes (15): EmployeeLoginPage(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+7 more)

### Community 126 - "sponsored-hours-pricing.ts"
Cohesion: 0.22
Nodes (10): parisHourInstant(), elapsedHoursCount(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, parisSlotEnd(), SPONSORED_HOUR_RATE_CENTS, SponsoredDayBreakdown (+2 more)

### Community 127 - "HourlySchedulePicker"
Cohesion: 0.22
Nodes (14): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotsToHours() (+6 more)

### Community 128 - "card-deck.tsx"
Cohesion: 0.18
Nodes (13): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+5 more)

### Community 129 - "scan/ui.tsx"
Cohesion: 0.06
Nodes (56): GET(), ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeScanPage(), EmployeeProfile, EmployeeScanScreen(), Phase (+48 more)

### Community 130 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employee-invitation-service.ts"
Cohesion: 0.17
Nodes (19): GET(), POST(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate() (+11 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 136 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 137 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 138 - "sponsored-test-broadcast.test.ts"
Cohesion: 0.22
Nodes (8): adFindUnique, adRow, broadcastDelete, broadcastFindUnique, broadcastUpdate, broadcastUpsert, syncAll, walletCount

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.20
Nodes (16): ad(), approvedAd(), asAdmin(), asCustomer(), asMerchant(), ctx(), customerCard(), dataUrl() (+8 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.14
Nodes (12): ref_sharp, files, INPUT_DIR, adminStage(), createAd(), ctx(), fake, h (+4 more)

### Community 143 - "sponsored-banner.tsx"
Cohesion: 0.36
Nodes (6): LAYOUT_BY_VARIANT, SponsoredBanner(), SponsoredAd, SponsoredOfferCard(), SponsoredOfferLayout, SponsoredVariant

### Community 144 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 145 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 146 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 149 - "types.ts"
Cohesion: 0.16
Nodes (8): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList(), ScanResultCardPayload

### Community 150 - "scripts/campaign-worker.ts"
Cohesion: 0.60
Nodes (5): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick()

### Community 151 - "profile-page.tsx"
Cohesion: 0.18
Nodes (15): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+7 more)

### Community 152 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.14
Nodes (17): DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter(), markOneRead(), openNotification() (+9 more)

### Community 155 - "finalisation/page.tsx"
Cohesion: 0.27
Nodes (6): FinalisationPage(), FinalisationForm(), isSmsConfigured(), sendSms(), smsConfigHint(), SmsSendResult

### Community 156 - "hashToken"
Cohesion: 0.67
Nodes (5): DELETE(), GET(), parseUserAgent(), hashToken(), tokenFromRequest()

### Community 157 - "CampagnesPanel"
Cohesion: 0.22
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 158 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 160 - "ad-detail.tsx"
Cohesion: 0.11
Nodes (17): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+9 more)

### Community 161 - "landing-hero-visual.tsx"
Cohesion: 0.33
Nodes (5): CoffeeIcon(), QrCodeIcon(), WalletCardsIcon(), WifiIcon(), LandingHeroVisual()

### Community 162 - "caisse-scan.test.ts"
Cohesion: 0.07
Nodes (36): main(), prisma, requiredEnv(), upsertEmployee(), bcryptjs, qrcode, main(), prisma (+28 more)

### Community 163 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 164 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 165 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.15
Nodes (24): main(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS (+16 more)

### Community 167 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 168 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 169 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

### Community 170 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 171 - "insight-permissions.test.ts"
Cohesion: 0.40
Nodes (4): admin, cashier, grantedCashier, manager

### Community 173 - "card-template-schema.ts"
Cohesion: 0.12
Nodes (18): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle, CardProgressColors (+10 more)

### Community 175 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 176 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 177 - "landing-header.tsx"
Cohesion: 0.67
Nodes (3): isInternalRoute(), LandingHeader(), NAV_LINKS

### Community 178 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

## Knowledge Gaps
- **1011 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1006 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1364 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `scan/ui.tsx`, `loyalty-labels.ts`, `app/ui.tsx`, `ouvrir/route.ts`, `react`, `merchant-card-template-service.ts`, `employe/layout.tsx`, `cards-index.tsx`, `super-admin-campaign-moderation.test.ts`, `campaign-moderation-home.tsx`, `api-guard.ts`, `qa-login/page.tsx`, `caisse-scan-route.test.ts`, `[id]/merchant-detail.tsx`, `clients/ui.tsx`, `types.ts`, `profile-page.tsx`, `google-auth.ts`, `middleware.ts`, `sponsored-slot.tsx`, `prisma.ts`, `finalisation/page.tsx`, `customer-loyalty-overview.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `customer-preferences-route.test.ts`, `ad-visuals.ts`, `customer-onboarding.ts`, `api-merchant-statistics-route.test.ts`, `media-storage.ts`, `super-admin-ad-moderation.test.ts`, `demo-session.ts`, `src/app/page.tsx`, `wallet-home.tsx`, `landing-footer.tsx`, `landing-header.tsx`, `qa-login.ts`, `carte/avantages/page.tsx`, `super-admin/layout.tsx`, `loyalty-context.ts`, `ref_node_path`, `card-enlarged-view.tsx`, `demo-routing.test.ts`, `interactive-loyalty-card.tsx`, `vitest`, `demo-visual.ts`, `cn`, `unsubscribe-token.ts`, `marketing-topup-route.test.ts`, `super-admin-session.ts`, `profile/route.ts`, `session.ts`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `layout-client.tsx`, `tarifs/page.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `profile-shared.tsx`, `employee-session.ts`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `loyalty-labels.ts`, `next`, `merchant-card-template-service.ts`, `ouvrir/route.ts`, `react`, `loyalty-program.ts`, `stripe.ts`, `google-wallet-appearance.ts`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `validation.ts`, `card-editor-canvas.tsx`, `@prisma/client`, `loyalty-service.ts`, `insight-period.ts`, `super-admin.test.ts`, `google-auth.ts`, `middleware.ts`, `webhook/route.ts`, `prisma.ts`, `sponsored-placements.test.ts`, `customer-loyalty-overview.ts`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `ad-visuals.ts`, `customer-onboarding.ts`, `stripe-webhook-marketing.test.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-commit.ts`, `loyalty-program-publication.ts`, `qa-login.ts`, `ref_node_path`, `loyalty-context.ts`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `sponsored-test-broadcast.ts`, `card-enlarged-view.tsx`, `platform-stats.ts`, `demo-routing.test.ts`, `stripe-webhook-route.test.ts`, `fake-ad-db.ts`, `merchant-card-renderer.tsx`, `qr-cache.ts`, `unsubscribe-token.ts`, `marketing-topup-route.test.ts`, `requireMerchantAdmin`, `app/app/connexion/page.tsx`, `ad-visual-journeys.test.ts`, `hosts.ts`, `src/app/layout.tsx`, `[kind]/route.ts`, `campaign-worker.test.ts`, `tarifs/page.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `use-wallet-unlock-animation.ts`, `campaign-confirm-route.test.ts`, `card-deck.tsx`, `scan/ui.tsx`, `employee-invitation-service.ts`, `super-admin-campaign-moderation.test.ts`, `landing-page.test.ts`, `sponsored-test-broadcast.test.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `caisse-scan-route.test.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-service.test.ts`, `campaign-audience.test.ts`, `caisse-scan.test.ts`, `loyalty-reward-removal.ts`, `customer-preferences-route.test.ts`, `marketing-balance.test.ts`, `api-merchant-statistics-route.test.ts`, `super-admin-ad-moderation.test.ts`, `insight-permissions.test.ts`, `campaign-quota.test.ts`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `loyalty-labels.ts`, `next`, `merchant-card-template-service.ts`, `ouvrir/route.ts`, `employee-invitation-service.ts`, `loyalty-program.ts`, `stripe.ts`, `cards-index.tsx`, `scan/ui.tsx`, `loyalty-widget.ts`, `validation.ts`, `card-editor-canvas.tsx`, `api-guard.ts`, `loyalty-service.ts`, `ad-visual-workflow.ts`, `loyalty-service.test.ts`, `jsonError`, `types.ts`, `super-admin.test.ts`, `google-auth.ts`, `google-wallet.ts`, `webhook/route.ts`, `prisma.ts`, `customer-loyalty-overview.ts`, `lib/campaign-worker.ts`, `programme/ui.tsx`, `card-editor.tsx`, `caisse-scan.test.ts`, `package.json`, `loyalty-reward-removal.ts`, `customer-onboarding.ts`, `sponsored-selection.ts`, `loyalty-commit.ts`, `wallet-home.tsx`, `loyalty-program-publication.ts`, `card-editor-properties.tsx`, `qa-login.ts`, `loyalty-context.ts`, `insight-stats.ts`, `sponsored-test-broadcast.ts`, `platform-stats.ts`, `merchant-card-renderer.tsx`, `cn`, `requireMerchantAdmin`, `super-admin-session.ts`, `profile/route.ts`, `session.ts`, `customer/history/route.ts`, `hosts.ts`, `use-wallet-unlock-animation.ts`, `employee-session.ts`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1011 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `loyalty-labels.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.07340647857889238 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05649122807017544 - nodes in this community are weakly interconnected._